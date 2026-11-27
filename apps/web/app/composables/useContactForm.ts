import type { ContactRequest, ContactResponse, UbigeoResponse } from '@ccxp/contracts'
import { ref } from 'vue'
import contactJson from '@/data/contact.json'

export function useContactForm() {
  // ================== ESTADOS ==================
  const nombres = ref('')
  const apellidos = ref('')
  const dni = ref('')
  const telefono = ref('')
  const email = ref('')
  const empresa = ref('')
  const mensaje = ref('')
  const tipo = ref('Cotización')

  const departamento = ref('')
  const provincia = ref('')
  const distrito = ref('')

  const departamentos = ref<UbigeoResponse>([])
  const provincias = ref<UbigeoResponse>([])
  const distritos = ref<UbigeoResponse>([])

  // Estado de carga para prevenir múltiples envíos
  const isLoading = ref(false)

  // ================== VALIDACIONES ==================
  const validarDNI = (v: string) => {
    if (!v) return 'El DNI es obligatorio'
    if (!/^\d{8}$/.test(v)) return 'El DNI debe tener 8 dígitos'
    return ''
  }

  const validarTelefono = (v: string) => {
    if (!v) return 'El teléfono es obligatorio'
    if (!/^9\d{8}$/.test(v)) return 'Debe empezar con 9 y tener 9 dígitos'
    return ''
  }

  const validarEmail = (v: string) => {
    if (!v) return 'El correo es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Correo inválido'
    return ''
  }

  const validarTexto = (v: string, label: string) => {
    if (!v.trim()) return `${label} es obligatorio`
    if (v.trim().length < 2) return `${label} muy corto`
    return ''
  }

  const validarFormulario = () => {
    const errores: Record<string, string> = {}

    errores.nombres = validarTexto(nombres.value, 'Nombres')
    errores.apellidos = validarTexto(apellidos.value, 'Apellidos')
    errores.dni = validarDNI(dni.value)
    errores.telefono = validarTelefono(telefono.value)
    errores.email = validarEmail(email.value)
    if (!mensaje.value || mensaje.value.length < 10) errores.mensaje = 'Mensaje muy corto'
    if (!departamento.value) errores.departamento = 'Seleccione departamento'
    if (!provincia.value) errores.provincia = 'Seleccione provincia'
    if (!distrito.value) errores.distrito = 'Seleccione distrito'

    const erroresFiltrados = Object.fromEntries(
      Object.entries(errores).filter(([, message]) => message.length > 0),
    )

    return {
      valido: Object.keys(erroresFiltrados).length === 0,
      errores: erroresFiltrados,
    }
  }

  // ================== FORMATEO ==================
  const formatearDNI = (v: string) => (dni.value = v.replace(/\D/g, '').slice(0, 8))
  const formatearTelefono = (v: string) => (telefono.value = v.replace(/\D/g, '').slice(0, 9))
  const formatearNombres = (v: string) =>
    (nombres.value = v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))
  const formatearApellidos = (v: string) =>
    (apellidos.value = v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))

  // ================== UBIGEO ==================
  const loadDepartamentos = async () => {
    try {
      departamentos.value = await $fetch<UbigeoResponse>('/api/ubigeo/departamentos')
    } catch (error) {
      console.error('Error al cargar departamentos:', error)
      departamentos.value = []
    }
  }

  const loadProvincias = async () => {
    // Validar que haya un departamento seleccionado
    if (!departamento.value) {
      provincias.value = []
      provincia.value = ''
      distrito.value = ''
      distritos.value = []
      return
    }

    try {
      // Codificar el nombre del departamento para la URL
      const depEncoded = encodeURIComponent(departamento.value)
      provincias.value = await $fetch<UbigeoResponse>(`/api/ubigeo/provincias/${depEncoded}`)
      provincia.value = ''
      distrito.value = ''
      distritos.value = []
    } catch (error) {
      console.error('Error al cargar provincias:', error)
      provincias.value = []
      provincia.value = ''
      distrito.value = ''
      distritos.value = []
    }
  }

  const loadDistritos = async () => {
    // Validar que haya departamento y provincia seleccionados
    if (!departamento.value || !provincia.value) {
      distritos.value = []
      distrito.value = ''
      return
    }

    try {
      // Codificar los nombres para la URL
      const depEncoded = encodeURIComponent(departamento.value)
      const provEncoded = encodeURIComponent(provincia.value)
      distritos.value = await $fetch<UbigeoResponse>(
        `/api/ubigeo/distritos/${depEncoded}/${provEncoded}`,
      )
      distrito.value = ''
    } catch (error) {
      console.error('Error al cargar distritos:', error)
      distritos.value = []
      distrito.value = ''
    }
  }

  loadDepartamentos()

  // ================== ENVÍO EMAIL + WHATSAPP ==================
  const sendWhatsApp = async () => {
    // Prevenir múltiples envíos
    if (isLoading.value) return { success: false, errores: {} }

    const { valido, errores } = validarFormulario()
    if (!valido) return { success: false, errores }

    // Activar estado de carga
    isLoading.value = true

    try {
      const payload: ContactRequest = {
        nombres: nombres.value,
        apellidos: apellidos.value,
        dni: dni.value,
        telefono: telefono.value,
        email: email.value,
        empresa: empresa.value,
        mensaje: mensaje.value,
        tipo: tipo.value,
        departamento: departamento.value,
        provincia: provincia.value,
        distrito: distrito.value,
      }
      await $fetch<ContactResponse>('/api/contacto', {
        method: 'POST',
        body: payload,
      })

      // 💬 WHATSAPP
      const phone = contactJson.whatsappPhone
      const text = `
*NUEVO ${tipo.value.toUpperCase()}*

Nombre: ${nombres.value} ${apellidos.value}
DNI: ${dni.value}
Teléfono: ${telefono.value}
Email: ${email.value}
${empresa.value ? `Empresa: ${empresa.value}` : ''}

${departamento.value} / ${provincia.value} / ${distrito.value}

${mensaje.value}
`.trim()

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank')

      return { success: true, errores: {} }
    } catch (error) {
      console.error('Error al enviar:', error)
      return {
        success: false,
        errores: { general: 'Error al enviar el formulario. Por favor, intente nuevamente.' },
      }
    } finally {
      // Desactivar estado de carga
      isLoading.value = false
    }
  }

  return {
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
    validarNombres: (v: string) => validarTexto(v, 'Nombres'),
    validarApellidos: (v: string) => validarTexto(v, 'Apellidos'),
    validarMensaje: (v: string) => (!v || v.length < 10 ? 'Mensaje muy corto' : ''),
    sendWhatsApp,
    isLoading,
  }
}
