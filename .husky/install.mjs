// Skip Husky install in production and CI
if (process.env.HUSKY === '0') {
  process.exit(0);
}
const husky = (await import('husky')).default;
console.log(husky());
