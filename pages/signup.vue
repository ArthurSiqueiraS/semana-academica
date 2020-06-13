<template>
  <div class="d-flex justify-center my-4">
    <v-col cols="12" sm="10" md="8" lg="6" xl="4">
      <v-row no-gutters justify="end" class="mb-2">
        <v-btn small rounded depressed color="accent" to="/login">
          Já estou inscrito<v-icon small right>login</v-icon>
        </v-btn>
      </v-row>
      <v-stepper v-model="step" class="transparent elevation-0">
        <template>
          <v-stepper-header class="elevation-0">
            <template v-for="n in steps">
              <v-stepper-step
                :key="`${n}-step`"
                :complete="step > n"
                :step="n"
                :editable="n == 1 && step < 3"
              >
                {{ stepTitles[n - 1] }}
              </v-stepper-step>

              <v-divider v-if="n !== steps" :key="n"></v-divider>
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content
              v-for="n in steps"
              :key="`${n}-content`"
              :step="n"
            >
              <v-card class="pa-8" outlined flat shaped>
                <v-form v-if="n == 1" ref="form" lazy-validation>
                  <div class="d-flex justify-center">
                    <v-col cols="12" sm="10">
                      <v-col cols="12">
                        <v-text-field
                          v-model="user.name"
                          outlined
                          rounded
                          dense
                          label="Nome"
                          :rules="[$validations.required('nome')]"
                          validate-on-blur
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="user.email"
                          outlined
                          rounded
                          dense
                          label="E-mail"
                          :rules="[
                            $validations.required('e-mail'),
                            $validations.email()
                          ]"
                          validate-on-blur
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="user.studentId"
                          v-mask="$validations.masks.studentId"
                          outlined
                          rounded
                          dense
                          label="Matrícula"
                          :rules="[
                            $validations.required('matrícula'),
                            $validations.studentId()
                          ]"
                          validate-on-blur
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="user.cpf"
                          v-mask="$validations.masks.cpf"
                          outlined
                          rounded
                          dense
                          label="CPF"
                          :rules="[
                            $validations.required('CPF'),
                            $validations.cpf()
                          ]"
                          validate-on-blur
                        ></v-text-field>
                      </v-col>
                    </v-col>
                  </div>
                  <v-divider class="my-4" />
                  <v-card-actions>
                    <v-slide-x-transition>
                      <div v-if="!valid" class="error--text mr-2">
                        Preencha todos os campos corretamente
                      </div>
                    </v-slide-x-transition>
                    <v-spacer />
                    <v-btn
                      depressed
                      rounded
                      color="primary"
                      class="px-4"
                      :loading="loading"
                      @click="validateForm"
                    >
                      Continuar
                    </v-btn>
                  </v-card-actions>
                </v-form>
                <div v-if="n == 2" class="text-center">
                  <div class="primary--text title text-uppercase">
                    <v-spacer />
                    Confirme seus dados
                    <v-spacer />
                  </div>
                  <div
                    class="subtitle-1 font-weight-light d-flex flex-column align-center my-4"
                  >
                    <v-card outlined shaped class="accent--text py-4 px-8">
                      <v-row>
                        <span class="primary--text font-weight-bold mr-2">
                          Nome:
                        </span>
                        {{ user.name }}
                      </v-row>
                      <v-row>
                        <span class="primary--text font-weight-bold mr-2">
                          E-mail:
                        </span>
                        {{ user.email }}
                      </v-row>
                      <v-row>
                        <span class="primary--text font-weight-bold mr-2">
                          Matrícula:
                        </span>
                        {{ user.studentId }}
                      </v-row>
                      <v-row>
                        <span class="primary--text font-weight-bold mr-2">
                          CPF:
                        </span>
                        {{ user.cpf }}
                      </v-row>
                    </v-card>
                    <div class="accent--text font-weight-bold mt-4">
                      Sua senha de acesso: {{ password }}
                    </div>
                  </div>
                  <v-divider class="mt-8 mb-4" />

                  <v-card-actions
                    class="d-flex flex-column align-center font-weight-light"
                  >
                    <div>
                      Deseja confirmar o cadastro?
                    </div>
                    <div class="error--text caption">
                      (você não poderá alterar estes dados após a confirmação)
                    </div>
                    <v-spacer />
                  </v-card-actions>
                  <div
                    class="d-flex flex-column-reverse flex-md-row align-center justify-center mt-2"
                  >
                    <v-btn
                      :outlined="!mobile"
                      :text="mobile"
                      rounded
                      color="info"
                      class="mt-2 mt-md-0 mr-md-2"
                      width="150"
                      :disabled="loading"
                      @click="lastStep"
                    >
                      <v-icon small class="mr-1">navigate_before</v-icon>Voltar
                    </v-btn>
                    <v-btn
                      depressed
                      rounded
                      color="primary"
                      width="150"
                      :loading="loading"
                      @click="createUser"
                    >
                      Confirmar<v-icon small class="ml-1">check</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </template>
      </v-stepper>
      <v-alert
        v-for="(dup, key) in duplicates"
        :key="key"
        v-model="dup.value"
        :transition="alertTransition"
        type="error"
        class="mx-12"
        text
        outlined
        dense
        dismissible
        >{{ dup.text }} já cadastrado</v-alert
      >
    </v-col>
    <v-snackbar
      top
      elevation="16"
      :value="userCreated"
      color="success"
      @click="userCreated = false"
      >Usuário criado com sucesso</v-snackbar
    >
  </div>
</template>
<script>
import { mask } from 'vue-the-mask'
export default {
  directives: {
    mask
  },
  auth: 'guest',
  data() {
    return {
      step: 1,
      steps: 3,
      stepTitles: ['Cadastro', 'Confirmação', 'Pagamento'],
      valid: true,
      user: {
        name: '',
        email: '',
        studentId: '',
        cpf: ''
      },
      duplicates: {
        email: { text: 'E-mail', value: false },
        studentId: { text: 'Número de matrícula', value: false },
        cpf: { text: 'CPF', value: false }
      },
      loading: false,
      alertTransition: 'scale-transition',
      userCreated: false
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    noDuplicates() {
      return !Object.values(this.duplicates)
        .map((d) => d.value)
        .includes(true)
    },
    password() {
      return this.user.cpf.replace(/\D/g, '')
    }
  },
  methods: {
    async validateForm() {
      this.valid = this.$refs.form[this.step - 1].validate()
      if (this.valid) {
        this.loading = true

        const promises = Object.keys(this.duplicates).map(async (key) => {
          const params = {}
          params[key] = this.user[key]
          const search = await this.$axios.get('/users', { params })

          this.duplicates[key].value = search.data.data.length > 0
        })

        await Promise.all(promises)

        if (this.noDuplicates) {
          this.nextStep()
        }

        this.loading = false
      }
    },
    nextStep() {
      if (this.step < this.steps) {
        this.valid = true
        this.step++
      }
    },
    lastStep() {
      this.step--
    },
    async createUser() {
      this.loading = true
      await this.$axios.post('/users', {
        ...this.user,
        password: this.password
      })

      this.loading = false
      this.userCreated = true
      this.nextStep()
    }
  }
}
</script>
