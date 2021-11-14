import os from 'os'

export default () => {
  const cpus = os.cpus()
  // console.log(cpus)
  return cpus
}
