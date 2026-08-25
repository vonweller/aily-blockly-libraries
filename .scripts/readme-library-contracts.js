const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CONTRACT_ROOT = path.join(
  ROOT,
  '.scripts',
  'contracts',
  'readme-library-contracts',
);
const CONTRACT_REPOSITORY_PREFIX = '.scripts/contracts/readme-library-contracts/';

function normalizeLibraryName(library) {
  const value = String(library || '').replace(/\\/g, '/').replace(/\/$/, '');
  const name = value.split('/').pop();
  if (!name || name === '.' || name === '..' || /[\\/\0]/.test(name)) {
    throw new Error(`Invalid library name for README contract: ${library}`);
  }
  return name;
}

function contractPathForLibrary(library) {
  return path.join(CONTRACT_ROOT, `${normalizeLibraryName(library)}.json`);
}

function contractRepositoryPathForLibrary(library) {
  return `${CONTRACT_REPOSITORY_PREFIX}${normalizeLibraryName(library)}.json`;
}

function libraryFromContractRepositoryPath(filePath) {
  const normalized = String(filePath || '').replace(/\\/g, '/');
  if (!normalized.startsWith(CONTRACT_REPOSITORY_PREFIX) || !normalized.endsWith('.json')) {
    return null;
  }
  const relative = normalized.slice(CONTRACT_REPOSITORY_PREFIX.length);
  if (!relative || relative.includes('/')) return null;
  return relative.slice(0, -'.json'.length) || null;
}

function parseContract(content, label) {
  let contract;
  try {
    contract = JSON.parse(String(content).replace(/^\uFEFF/, ''));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
    throw new Error(`${label} must contain a JSON object`);
  }
  return contract;
}

function loadLibraryContract(library) {
  const contractPath = contractPathForLibrary(library);
  if (!fs.existsSync(contractPath)) return null;
  return parseContract(
    fs.readFileSync(contractPath, 'utf8'),
    contractRepositoryPathForLibrary(library),
  );
}

function listLibraryContractNames() {
  if (!fs.existsSync(CONTRACT_ROOT)) return [];
  return fs.readdirSync(CONTRACT_ROOT, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => entry.name.slice(0, -'.json'.length))
    .sort();
}

function validateLibraryContractInventory(libraries) {
  const expected = new Set((libraries || []).map(normalizeLibraryName));
  const expectedByLowerCase = new Map(
    [...expected].map(name => [name.toLowerCase(), name]),
  );
  const seenByLowerCase = new Map();
  const errors = [];
  for (const name of listLibraryContractNames()) {
    const lowerCaseName = name.toLowerCase();
    if (seenByLowerCase.has(lowerCaseName)) {
      errors.push(`duplicate contract names differ only by case: ${seenByLowerCase.get(lowerCaseName)}.json and ${name}.json`);
      continue;
    }
    seenByLowerCase.set(lowerCaseName, name);
    if (expected.has(name)) continue;
    if (expectedByLowerCase.has(lowerCaseName)) {
      errors.push(`${name}.json must match library directory case: ${expectedByLowerCase.get(lowerCaseName)}.json`);
    } else {
      errors.push(`${name}.json does not map to a tracked Blockly library`);
    }
  }
  return errors;
}

module.exports = {
  CONTRACT_ROOT,
  CONTRACT_REPOSITORY_PREFIX,
  contractPathForLibrary,
  contractRepositoryPathForLibrary,
  libraryFromContractRepositoryPath,
  listLibraryContractNames,
  loadLibraryContract,
  normalizeLibraryName,
  parseContract,
  validateLibraryContractInventory,
};
