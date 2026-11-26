<template>
  <section :id="id" class="contact-section">
    <!-- HERO -->
    <div class="contact-hero">
      <div class="contact-hero-overlay"></div>
      <div class="contact-hero-content">
        <h2 class="contact-title">CONTÁCTANOS</h2>
        <p class="contact-subtitle">
          Estamos disponibles para atender sus consultas
        </p>
      </div>
    </div>

    <!-- FORM + MAPA -->
    <div class="contact-main">
      <!-- FORMULARIO -->
      <div class="contact-form">
        <h3>Formulario de contacto</h3>
        
        <div class="form-grid">
          <!-- Nombres -->
          <div>
            <input 
              placeholder="Nombres *" 
              :value="nombres"
              @input="onNombresInput"
              @blur="validateField('nombres')"
              :class="{ 'input-error': errors.nombres }"
            />
            <span v-if="errors.nombres" class="error-msg">{{ errors.nombres }}</span>
          </div>

          <!-- Apellidos -->
          <div>
            <input 
              placeholder="Apellidos *" 
              :value="apellidos"
              @input="onApellidosInput"
              @blur="validateField('apellidos')"
              :class="{ 'input-error': errors.apellidos }"
            />
            <span v-if="errors.apellidos" class="error-msg">{{ errors.apellidos }}</span>
          </div>

          <!-- DNI -->
          <div>
            <input 
              placeholder="DNI (8 dígitos) *" 
              :value="dni"
              @input="onDNIInput"
              @blur="validateField('dni')"
              :class="{ 'input-error': errors.dni }"
            />
            <span v-if="errors.dni" class="error-msg">{{ errors.dni }}</span>
          </div>

          <!-- Teléfono -->
          <div>
            <input 
              placeholder="Celular (9 dígitos) *" 
              :value="telefono"
              @input="onTelefonoInput"
              @blur="validateField('telefono')"
              :class="{ 'input-error': errors.telefono }"
            />
            <span v-if="errors.telefono" class="error-msg">{{ errors.telefono }}</span>
          </div>

          <!-- Email -->
          <div>
            <input 
              placeholder="Correo electrónico *" 
              v-model="email"
              type="email"
              @blur="validateField('email')"
              :class="{ 'input-error': errors.email }"
            />
            <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
          </div>

          <!-- Empresa -->
          <div>
            <input 
              placeholder="Empresa (opcional)" 
              v-model="empresa"
            />
          </div>

          <!-- Departamento -->
          <div>
            <select 
              v-model="departamento" 
              @change="loadProvincias(); validateField('departamento')"
              :class="{ 'input-error': errors.departamento }"
            >
              <option value="">Departamento *</option>
              <option v-for="d in departamentos" :key="d">{{ d }}</option>
            </select>
            <span v-if="errors.departamento" class="error-msg">{{ errors.departamento }}</span>
          </div>

          <!-- Provincia -->
          <div>
            <select 
              v-model="provincia" 
              @change="loadDistritos(); validateField('provincia')"
              :class="{ 'input-error': errors.provincia }"
              :disabled="!departamento"
            >
              <option value="">Provincia *</option>
              <option v-for="p in provincias" :key="p">{{ p }}</option>
            </select>
            <span v-if="errors.provincia" class="error-msg">{{ errors.provincia }}</span>
          </div>

          <!-- Distrito -->
          <div>
            <select 
              v-model="distrito"
              @change="validateField('distrito')"
              :class="{ 'input-error': errors.distrito }"
              :disabled="!provincia"
            >
              <option value="">Distrito *</option>
              <option v-for="d in distritos" :key="d">{{ d }}</option>
            </select>
            <span v-if="errors.distrito" class="error-msg">{{ errors.distrito }}</span>
          </div>

          <div class="contact-type">
            <label class="radio-option">
              <input type="radio" value="Cotización" v-model="tipo" />
              <span></span>
              Cotización
            </label>
            <label class="radio-option">
              <input type="radio" value="Consulta" v-model="tipo" />
              <span></span>
              Consulta
            </label>
          </div>

          <!-- Mensaje -->
          <div class="full-width">
            <textarea
              rows="4"
              placeholder="Mensaje (mínimo 10 caracteres) *"
              v-model="mensaje"
              @blur="validateField('mensaje')"
              :class="{ 'input-error': errors.mensaje }"
            ></textarea>
            <span v-if="errors.mensaje" class="error-msg">{{ errors.mensaje }}</span>
          </div>

          <!-- Botón -->
          <button 
            type="button" 
            class="submit-btn" 
            @click="handleSubmit"
            :disabled="isLoading"
            :class="{ 'loading': isLoading }"
          >
            <span v-if="!isLoading">Enviar mensaje</span>
            <span v-else>
              <i class="fas fa-spinner fa-spin"></i> Enviando...
            </span>
          </button>
        </div>
      </div>

      <!-- MAPA -->
      <div class="contact-map">
        <iframe
          :src="contactMap.iframeUrl"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>

    <!-- INFO DE CONTACTO (CORRECCIÓN) -->
    <div class="contact-data">
      <div
        v-for="(item, index) in contactInfo"
        :key="index"
        class="contact-data-item"
      >
        <i :class="`fas ${item.icon}`"></i>
        <span>{{ item.label }}</span>
      </div>
    </div>

  </section>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useContactForm } from '~/composables/useContactForm'
import { useContact } from '~/composables/useContact'

defineProps({
  id: { type: String, default: 'contacto' }
})

// Mapa + datos
const { contactInfo, contactMap } = useContact()

// Formulario
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
  validarFormulario,
  validarDNI,
  validarTelefono,
  validarEmail,
  validarNombres,
  validarApellidos,
  validarMensaje,
  sendWhatsApp,
  isLoading
} = form

// Input handlers para TS
const onNombresInput = (e: Event) => formatearNombres((e.target as HTMLInputElement).value)
const onApellidosInput = (e: Event) => formatearApellidos((e.target as HTMLInputElement).value)
const onDNIInput = (e: Event) => formatearDNI((e.target as HTMLInputElement).value)
const onTelefonoInput = (e: Event) => formatearTelefono((e.target as HTMLInputElement).value)

// Errores
const errors = ref<Record<string, string>>({})

// Validar campo individual
const validateField = (field: string) => {
  switch (field) {
    case 'nombres': errors.value.nombres = validarNombres(nombres.value); break
    case 'apellidos': errors.value.apellidos = validarApellidos(apellidos.value); break
    case 'dni': errors.value.dni = validarDNI(dni.value); break
    case 'telefono': errors.value.telefono = validarTelefono(telefono.value); break
    case 'email': errors.value.email = validarEmail(email.value); break
    case 'mensaje': errors.value.mensaje = validarMensaje(mensaje.value); break
    case 'departamento': errors.value.departamento = !departamento.value ? 'Seleccione un departamento' : ''; break
    case 'provincia': errors.value.provincia = !provincia.value ? 'Seleccione una provincia' : ''; break
    case 'distrito': errors.value.distrito = !distrito.value ? 'Seleccione un distrito' : ''; break
  }
}

// Manejar envío
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
    // Limpiar campos
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
    // Limpiar listas de provincias y distritos
    provincias.value = []
    distritos.value = []
  }
}
</script>
<style src="../assets/css/components/ContactSection.css"></style>
<style scoped>
.input-error {
  border-color: #e74c3c !important;
  background-color: #ffeaea !important;
}
.input-error:focus {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.18) !important;
}
.error-msg {
  display: block;
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.3rem;
  font-weight: 500;
}
.form-grid > div { display: flex; flex-direction: column; }
.full-width { grid-column: span 2; }
select:disabled { opacity: 0.5; cursor: not-allowed; background-color: #f5f5f5; }
input:focus:not(.input-error), select:focus:not(.input-error), textarea:focus:not(.input-error) {
  border-color: #1a3a5f;
  box-shadow: 0 0 0 3px rgba(26, 58, 95, 0.18);
}
</style>
