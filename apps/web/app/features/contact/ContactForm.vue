<template>
  <div class="contact-form">
    <h3>Formulario de contacto</h3>

    <div class="form-grid">
      <div>
        <BaseInput
          :model-value="nombres"
          placeholder="Nombres *"
          aria-label="Nombres"
          :error="errors.nombres"
          @update:model-value="formatearNombres"
          @blur="validateField('nombres')"
        />
      </div>

      <div>
        <BaseInput
          :model-value="apellidos"
          placeholder="Apellidos *"
          aria-label="Apellidos"
          :error="errors.apellidos"
          @update:model-value="formatearApellidos"
          @blur="validateField('apellidos')"
        />
      </div>

      <div>
        <BaseInput
          :model-value="dni"
          placeholder="DNI (8 dígitos) *"
          aria-label="DNI"
          inputmode="numeric"
          :error="errors.dni"
          @update:model-value="formatearDNI"
          @blur="validateField('dni')"
        />
      </div>

      <div>
        <BaseInput
          :model-value="telefono"
          placeholder="Celular (9 dígitos) *"
          aria-label="Celular"
          inputmode="numeric"
          :error="errors.telefono"
          @update:model-value="formatearTelefono"
          @blur="validateField('telefono')"
        />
      </div>

      <div>
        <BaseInput
          v-model="email"
          type="email"
          placeholder="Correo electrónico *"
          aria-label="Correo electrónico"
          :error="errors.email"
          @blur="validateField('email')"
        />
      </div>

      <div>
        <BaseInput v-model="empresa" placeholder="Empresa (opcional)" aria-label="Empresa" />
      </div>

      <div>
        <BaseSelect
          v-model="departamento"
          aria-label="Departamento"
          :error="errors.departamento"
          @change="onDepartamentoChange"
        >
          <option value="">Departamento *</option>
          <option v-for="d in departamentos" :key="d">{{ d }}</option>
        </BaseSelect>
      </div>

      <div>
        <BaseSelect
          v-model="provincia"
          aria-label="Provincia"
          :error="errors.provincia"
          :disabled="!departamento"
          @change="onProvinciaChange"
        >
          <option value="">Provincia *</option>
          <option v-for="p in provincias" :key="p">{{ p }}</option>
        </BaseSelect>
      </div>

      <div>
        <BaseSelect
          v-model="distrito"
          aria-label="Distrito"
          :error="errors.distrito"
          :disabled="!provincia"
          @blur="validateField('distrito')"
        >
          <option value="">Distrito *</option>
          <option v-for="d in distritos" :key="d">{{ d }}</option>
        </BaseSelect>
      </div>

      <div class="contact-type">
        <label class="radio-option">
          <input v-model="tipo" type="radio" value="Cotización" />
          <span></span>
          Cotización
        </label>
        <label class="radio-option">
          <input v-model="tipo" type="radio" value="Consulta" />
          <span></span>
          Consulta
        </label>
      </div>

      <div class="full-width">
        <BaseInput
          v-model="mensaje"
          multiline
          :rows="4"
          placeholder="Mensaje (mínimo 10 caracteres) *"
          aria-label="Mensaje"
          :error="errors.mensaje"
          @blur="validateField('mensaje')"
        />
      </div>

      <BaseButton class="submit-btn" :loading="isLoading" @click="handleSubmit">
        <span v-if="!isLoading">Enviar mensaje</span>
        <span v-else> <i class="fas fa-spinner fa-spin"></i> Enviando... </span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseSelect from '~/components/base/BaseSelect.vue'
import { useContactForm } from '~/composables/useContactForm'

const form = useContactForm()

const {
  nombres,
  apellidos,
  dni,
  telefono,
  email,
  empresa,
  mensaje,
  tipo,
  departamento,
  provincia,
  distrito,
  departamentos,
  provincias,
  distritos,
  loadProvincias,
  loadDistritos,
  formatearDNI,
  formatearTelefono,
  formatearNombres,
  formatearApellidos,
  validarDNI,
  validarTelefono,
  validarEmail,
  validarNombres,
  validarApellidos,
  validarMensaje,
  sendWhatsApp,
  isLoading,
} = form

const errors = ref<Record<string, string>>({})

const validateField = (field: string) => {
  switch (field) {
    case 'nombres':
      errors.value.nombres = validarNombres(nombres.value)
      break
    case 'apellidos':
      errors.value.apellidos = validarApellidos(apellidos.value)
      break
    case 'dni':
      errors.value.dni = validarDNI(dni.value)
      break
    case 'telefono':
      errors.value.telefono = validarTelefono(telefono.value)
      break
    case 'email':
      errors.value.email = validarEmail(email.value)
      break
    case 'mensaje':
      errors.value.mensaje = validarMensaje(mensaje.value)
      break
    case 'departamento':
      errors.value.departamento = !departamento.value ? 'Seleccione un departamento' : ''
      break
    case 'provincia':
      errors.value.provincia = !provincia.value ? 'Seleccione una provincia' : ''
      break
    case 'distrito':
      errors.value.distrito = !distrito.value ? 'Seleccione un distrito' : ''
      break
  }
}

const onDepartamentoChange = () => {
  loadProvincias()
  validateField('departamento')
}

const onProvinciaChange = () => {
  loadDistritos()
  validateField('provincia')
}

const handleSubmit = async () => {
  const result = await sendWhatsApp()
  if (!result.success) {
    errors.value = result.errores
    setTimeout(() => {
      const firstError = document.querySelector('.input-error')
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  } else {
    errors.value = {}
    alert('Formulario enviado correctamente ✅')
    nombres.value = ''
    apellidos.value = ''
    dni.value = ''
    telefono.value = ''
    email.value = ''
    empresa.value = ''
    mensaje.value = ''
    tipo.value = 'Cotización'
    departamento.value = ''
    provincia.value = ''
    distrito.value = ''
    provincias.value = []
    distritos.value = []
  }
}
</script>

<style scoped>
.form-grid > div {
  display: flex;
  flex-direction: column;
}
.full-width {
  grid-column: span 2;
}
select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
}
input:focus:not(.input-error),
select:focus:not(.input-error),
textarea:focus:not(.input-error) {
  border-color: var(--ccip-navy);
  box-shadow: 0 0 0 3px rgba(26, 58, 95, 0.18);
}
</style>
