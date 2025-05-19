const fs = require('fs');
const path = require('path');
const glob = require('glob');


const packageFiles = glob.sync(path.join(__dirname, 'packages/**/package.json'), {
  ignore: ['**/node_modules/**'],
  absolute: true
});


const packageVersions = new Map();


packageFiles.forEach(packagePath => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (packageJson.name && packageJson.version) {
      packageVersions.set(packageJson.name, packageJson.version);
    }
  } catch (error) {
    console.error(`Error processing ${packagePath}:`, error);
  }
});

const replaceWorkspaceReferences = (dependencies) => {
  if (!dependencies) return dependencies;
  
  const result = { ...dependencies };
  for (const [dep, version] of Object.entries(result)) {
    if (version === 'workspace:*' && packageVersions.has(dep)) {
      result[dep] = `^${packageVersions.get(dep)}`;
    } else {
      if(version === 'workspace:*') {
        console.warn(`${dep} is a workspace dependency but no version is set`);
      }
    }
  }
  
  return result;
};



module.exports = {
  remove: [
    "scripts",
    "devDependencies",
    "config",
    "husky",
    "lint-staged",
    "clean-package",
    "eslintConfig",
    "typedocOptions",
  ],
  onClean: () => {
    const pckg = JSON.parse(fs.readFileSync('./package.json'));
    
    // Move workspace dependencies from dependencies to peerDependencies
    if (pckg.dependencies) {
      const workspaceDeps = {};
      const nonWorkspaceDeps = {};
      
      for (const [dep, version] of Object.entries(pckg.dependencies)) {
        if (version === 'workspace:*') {
          workspaceDeps[dep] = version;
        } else {
          nonWorkspaceDeps[dep] = version;
        }
      }
      
      // Update dependencies with only non-workspace deps
      pckg.dependencies = nonWorkspaceDeps;
      
      // Add workspace deps to peerDependencies
      if (!pckg.peerDependencies) {
        pckg.peerDependencies = {};
      }
      Object.assign(pckg.peerDependencies, workspaceDeps);
    }

    if(pckg.peerDependencies) {
      pckg.peerDependencies = replaceWorkspaceReferences(pckg.peerDependencies);
    }
    if(pckg.dependencies) {
      pckg.dependencies = replaceWorkspaceReferences(pckg.dependencies);
    }
    fs.writeFileSync('./package.json', JSON.stringify(pckg, null, 2));
  }
};
