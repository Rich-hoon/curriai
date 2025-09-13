module.exports = {
  hooks: {
    readPackage(pkg, context) {
      // Ensure workspace dependencies are resolved correctly
      if (pkg.dependencies) {
        Object.keys(pkg.dependencies).forEach(dep => {
          if (pkg.dependencies[dep].startsWith('workspace:')) {
            // Keep workspace protocol for proper resolution
            return;
          }
        });
      }
      return pkg;
    }
  }
};
