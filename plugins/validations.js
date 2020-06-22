const validateCpf = require('validar-cpf')

export default function(_, inject) {
  inject('validations', {
    studentId() {
      return (id) => id.length === 8 || 'Número de matrícula inválido'
    },
    cpf() {
      return (cpf) => cpf === '' || validateCpf(cpf) || 'CPF inválido'
    },
    email() {
      return (email) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return email === '' || pattern.test(email) || 'E-mail inválido'
      }
    },
    required(field) {
      return (f) =>
        (f != null && Object.values(f).length > 0) ||
        f === true ||
        f === false ||
        `O campo${field ? ' ' + field : ''} é obrigatório`
    },
    masks: {
      studentId: '########',
      cpf: '###.###.###-##'
    }
  })
}
