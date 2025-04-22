const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');

const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { ChatOpenAI } = require('@langchain/openai');
const { StructuredOutputParser } = require('@langchain/core/output_parsers');
const { z } = require('zod'); // 使用 zod 替代 Python 中的 Pydantic


// 文件读取
async function readFile(filePath) {
    try {
        return await fs.readFile(filePath, 'utf-8');
    } catch (e) {
        console.error(`无法读取文件 ${filePath}: ${e}`);
        return '';
    }
}

// 文件内容写入
async function writeFile(filePath, content) {
    if (!content) {
        console.error(`内容为空，无法写入文件 ${filePath}`);
        return;
    }
    try {
        await fs.writeFile(filePath, content, 'utf-8');
    } catch (e) {
        console.error(`写入文件失败 ${filePath}: ${e}`);
    }
}

// 初始化聊天模型
function initChatModel(key, model, baseUrl) {
    return new ChatOpenAI({
        openAIApiBaseUrl: baseUrl,
        openAIApiKey: key,
        modelName: model,
        temperature: 0.1,
    });
}

// 提示模板
const i18nTemplatePrompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        `
    需要分析的代码内容是：{content}，
    规范文件readme: {readme_content}
    其中toolbox_name的值为: {toolbox_name}
    不需要别的描述说明，只需要根据规范文件的说明，提取出相应的内容组成json格式的模板文件即可，不要以markdown的格式返回
    `
    ],
    ['user', '{text}']
]);

const i18nPrompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        `
    模板内容为：{content}
    不用任何说明，直接将模板内容转换为指定的各种语言的版本即可
    `
    ],
    ['user', '{text}']
]);

// 定义输出模式
const I18nTemplateSchema = z.object({
    content: z.string().describe('内容')
});

const I18nSchema = z.object({
    lg: z.string().describe('语言类型, 简体中文：zh_cn，繁体中文：zh_hk, 英文：en, 日文：ja, 韩文：ko, 法文：fr, 西班牙文：es, 德文：de, 俄文：ru, 葡萄牙文：pt，阿拉伯文：ar'),
    content: z.string().describe('内容')
});

const I18nModelListSchema = z.object({
    i18n_list: z.array(I18nSchema).describe('语言类型列表')
});

// 生成i18n模板
async function genI18nTemplate(content, readmeContent, toolboxName, model, key, baseUrl) {
    const text = "根据readme的规范，提取出相应的信息生成模板文件的内容";

    const prompt = await i18nTemplatePrompt.invoke({
        content,
        readme_content: readmeContent,
        toolbox_name: toolboxName,
        text
    });

    const llm = initChatModel(key, model, baseUrl);
    const parser = StructuredOutputParser.fromZodSchema(I18nTemplateSchema);

    const response = await llm.invoke([
        prompt,
        { responseFormat: { type: "json_object" } }
    ]);

    return await parser.parse(response.content);
}

// 批量生成i18n
async function genI18nBatch(template, lgList, model, key, baseUrl) {
    const text = `将模板内容分别转换为${lgList.join(',')}`;

    const prompt = await i18nPrompt.invoke({
        content: template,
        text
    });

    const llm = initChatModel(key, model, baseUrl);
    const parser = StructuredOutputParser.fromZodSchema(I18nModelListSchema);

    const response = await llm.invoke([
        prompt,
        { responseFormat: { type: "json_object" } }
    ]);

    const result = await parser.parse(response.content);
    console.log("gen_i18n_batch result:", result);

    return result;
}

// 重试机制
async function withRetry(fn, maxRetries = 3) {
    let retries = 0;
    let lastError;

    while (retries < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            retries++;

            const delay = Math.min(1000 * Math.pow(2, retries - 1), 5000);
            console.log(`重试第${retries}次，等待${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

// 生成i18n代码
async function generateI18nCode(blockContent, toolboxName, readmeContent, prjPath, llmModel, llmKey, llmBaseUrl) {
    return await withRetry(async () => {
        // 生成i18n模板文件
        const i18nReadmeContent = readmeContent;

        const i18nTemplateContent = await genI18nTemplate(
            blockContent,
            i18nReadmeContent,
            toolboxName,
            llmModel,
            llmKey,
            llmBaseUrl
        );

        if (!i18nTemplateContent) {
            console.error("生成i18n模板失败");
            return false;
        }

        const lgList = [
            "简体中文(zh_cn)",
            "繁体中文(zh_hk)",
            "英文(en)",
            "日文(ja)",
            "韩文(ko)",
            "法文(fr)",
            "德文(de)",
            "阿拉伯文(ar)",
            "俄文(ru)",
            "西班牙文(es)",
            "葡萄牙文(pt)",
        ];

        const genResult = await genI18nBatch(i18nTemplateContent.content, lgList, llmModel, llmKey, llmBaseUrl);

        if (!genResult) {
            console.error("生成i18n失败");
            return false;
        }

        // 生成i18n文件
        const i18nPath = path.join(prjPath, "i18n");
        try {
            await fs.mkdir(i18nPath, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }

        for (const item of genResult.i18n_list) {
            const itemPath = path.join(i18nPath, `${item.lg}.json`);
            await writeFile(itemPath, item.content);
        }

        return true;
    });
}

// 主函数
async function main() {
    try {
        const directoriesStr = core.getInput('directories');
        const readmePath = core.getInput('readme');
        const llmModel = core.getInput('llmModel') || 'gpt-4o';
        const llmKey = core.getInput('llmKey') || '';
        const llmBaseUrl = core.getInput('llmBaseUrl') || '';

        console.log("directories: ", directoriesStr);
        console.log("README路径为: ", readmePath);

        const readmeContent = await readFile(readmePath);
        if (!readmeContent) {
            console.error("读取README.md失败");
            process.exit(1);
        }

        const directories = JSON.parse(directoriesStr);

        for (const dir of directories.split(',')) {
            try {
                const prjPath = path.join(process.cwd(), dir.trim());
                console.log("项目路径为: ", prjPath);

                const blockJsonPath = path.join(prjPath, "block.json");
                const blockContent = await readFile(blockJsonPath);
                if (!blockContent) {
                    console.error(`读取${dir}目录下的block.json失败`);
                    process.exit(1);
                }

                const toolboxJsonPath = path.join(prjPath, "toolbox.json");
                const toolboxContentStr = await readFile(toolboxJsonPath);
                if (!toolboxContentStr) {
                    console.error("读取toolbox.json失败");
                    process.exit(1);
                }

                const toolboxContent = JSON.parse(toolboxContentStr);
                const toolboxName = toolboxContent.name || "";
                console.log("toolbox_name为: ", toolboxName);

                // 生成i18n代码
                await generateI18nCode(blockContent, '', readmeContent, prjPath, llmModel, llmKey, llmBaseUrl);
            } catch (error) {
                console.error(`处理目录 ${dir} 时发生错误:`, error);
                process.exit(1);
            }
        }
    } catch (error) {
        console.error("执行失败:", error);
        process.exit(1);
    }
}

main();