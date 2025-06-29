import { ref, computed } from 'vue'

export function Form() {
  const formData = ref({
    Age: null as number | null,
    Gender: '',
    Academic_Level: '',
    Avg_Daily_Usage_Hours: 3,
    Most_Used_Platform: '',
    Affects_Academic_Performance: '',
    Sleep_Hours_Per_Night: 7,
    Mental_Health_Score: 0,
    Relationship_Status: '',
    Conflicts_Over_Social_Media: 0,
    Addicted_Score: 0
  })

  const errors = ref<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.value.Gender) newErrors.Gender = 'Selecciona un género'
    if (!formData.value.Academic_Level) newErrors.Academic_Level = 'Selecciona tu nivel académico'
    if (!formData.value.Age || formData.value.Age <= 0) newErrors.Age = 'Ingresa una edad válida'
    if (!formData.value.Most_Used_Platform) newErrors.Most_Used_Platform = 'Selecciona una red social'
    if (!formData.value.Affects_Academic_Performance) newErrors.Affects_Academic_Performance = 'Selecciona una opción'
    if (!formData.value.Relationship_Status) newErrors.Relationship_Status = 'Selecciona una opción'
    if (!formData.value.Sleep_Hours_Per_Night) newErrors.Sleep_Hours_Per_Night = 'Indica tus horas de sueño'
    if (formData.value.Conflicts_Over_Social_Media == null) newErrors.Conflicts_Over_Social_Media = 'Indica la frecuencia'

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  const genderOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' }
  ]

  const academicOptions = [
    { value: 'Preparatoria', label: 'Preparatoria' },
    { value: 'Licenciatura', label: 'Licenciatura' },
    { value: 'Posgrado', label: 'Posgrado' },
  ]

  const relationshipOptions = [
    { value: 'Soltero/a', label: 'Soltero/a' },
    { value: 'En una relación', label: 'En una relación' },
    { value: 'Es complicado', label: 'Es complicado' }
  ]

  const platforms = [
  {
    value: 'Instagram',
    label: 'Instagram',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-pink-500">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
    `,
  },
  {
    value: 'Facebook',
    label: 'Facebook',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-blue-600">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
    `,
  },
  {
    value: 'TikTok',
    label: 'TikTok',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-gray-800">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
    `,
  },
  {
    value: 'WhatsApp',
    label: 'WhatsApp',
    icon: `
    <svg viewBox="0 0 32 32" class="w-full h-full text-green-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M16.005 2.667c-7.364 0-13.338 5.974-13.338 13.338 0 2.352.621 4.65 1.797 6.667L2.667 29.333l6.805-1.797c1.933 1.13 4.117 1.732 6.533 1.732 7.364 0 13.333-5.969 13.333-13.333S23.369 2.667 16.005 2.667Zm0 24c-1.938 0-3.83-.528-5.467-1.528l-.391-.234-4.008 1.063 1.063-3.984-.257-.406a10.578 10.578 0 0 1-1.617-5.546c0-5.84 4.761-10.6 10.6-10.6s10.6 4.761 10.6 10.6-4.761 10.6-10.6 10.6Zm5.406-7.873c-.297-.148-1.75-.867-2.023-.967s-.469-.148-.664.148-.762.967-.933 1.166c-.171.195-.336.222-.633.074s-1.238-.457-2.355-1.457c-.87-.777-1.457-1.735-1.63-2.027-.172-.296-.018-.457.13-.605.133-.133.297-.336.445-.504.148-.171.196-.296.297-.495.099-.198.05-.371-.025-.52-.074-.148-.664-1.6-.91-2.192-.24-.576-.481-.498-.664-.508l-.566-.01c-.197 0-.519.074-.79.37s-1.036 1.012-1.036 2.467 1.06 2.857 1.209 3.054c.148.198 2.093 3.195 5.074 4.48.709.305 1.263.487 1.694.623.712.227 1.36.195 1.872.118.571-.085 1.75-.715 1.997-1.406.247-.69.247-1.28.173-1.406-.074-.124-.271-.198-.57-.347Z"/>
    </svg>
  `,
  },
  {
    value: 'YouTube',
    label: 'YouTube',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-red-600">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
    `,
  },
  {
    value: 'LinkedIn',
    label: 'LinkedIn',
    icon: `
    <svg viewBox="0 0 24 24" class="w-full h-full text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1-4.96 0 2.5 2.5 0 0 1 4.96 0ZM.5 8.5h4.96v14H.5v-14ZM8.5 8.5H13v2h.06c.63-1.2 2.18-2.46 4.44-2.46 4.75 0 5.63 3.13 5.63 7.2V22.5h-4.96v-6.5c0-1.55 0-3.53-2.15-3.53s-2.49 1.68-2.49 3.42v6.61H8.5v-14Z"/>
    </svg>
  `,
  },
  {
    value: 'Twitter',
    label: 'Twitter',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-sky-500">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
    `,
  },
  {
    value: 'Snapchat',
    label: 'Snapchat',
    icon: `
    <svg viewBox="0 0 256 256" class="w-full h-full text-[#FFFC00]" fill="currentColor">
      <path d="M243,194.5c-7.2,6.7-17.5,7.4-26.6,8-5.7.4-11.7.8-15.2,2.7s-6.8,6.7-10.2,11.3c-5.4,7.4-11.5,15.8-21.2,18.3s-18.6-1.9-26.8-5.7c-5.3-2.5-10.8-5.1-15-5.1s-9.7,2.6-15,5.1-13.7,6.4-21.2,6.4a27.7,27.7,0,0,1-5.6-.7c-9.7-2.5-15.8-10.9-21.2-18.3-3.4-4.6-6.8-9.4-10.2-11.3s-9.5-2.3-15.2-2.7c-9.1-.6-19.4-1.3-26.6-8a8,8,0,0,1,2.1-13.1c.3-.1,12.5-6,24.5-21.3a105.5,105.5,0,0,0,17.3-32.7l-19.9-8a8,8,0,1,1,6-14.8l18,7.2A160.5,160.5,0,0,0,64,80a64,64,0,0,1,128,0,160.5,160.5,0,0,0,3,31.8l18-7.2a8,8,0,0,1,6,14.8l-19.9,8a105.5,105.5,0,0,0,17.3,32.7c12.1,15.3,24.3,21.3,24.5,21.3a8,8,0,0,1,2.1,13.1Z"/>
    </svg>
  `,
  },
  {
    value: 'KakaoTalk',
    label: 'KakaoTalk',
    icon: `
    <svg viewBox="0 0 24 24" class="w-full h-full text-[#FEE500]" fill="currentColor">
      <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.07l-2.517 3.784 5.337-3.067c1.146.214 2.34.328 3.571.328 4.97 0 9-3.186 9-7.115C21 6.185 16.97 3 12 3z"/>
    </svg>
  `,
  },
  {
    value: 'LINE',
    label: 'LINE',
    icon: `
  <svg viewBox="0 0 24 24" class="w-full h-full text-[#00C300]" fill="currentColor">
      <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.07l-2.517 3.784 5.337-3.067c1.146.214 2.34.328 3.571.328 4.97 0 9-3.186 9-7.115C21 6.185 16.97 3 12 3z"/>
    </svg>
  `,
  },
  {
    value: 'VKontakte',
    label: 'VKontakte',
    icon: `
    <svg viewBox="0 0 24 24" class="w-full h-full text-[#0077FF]" fill="currentColor">
      <path d="M12.7 17.3c.4.4.7.7 1.1.7.4 0 .6-.2.6-.5 0-.2-.1-.4-.3-.7-.5-.6-1.1-1.2-1.6-1.8-.3-.4-.6-.8-.9-1.2-.1-.2-.2-.4-.1-.6.1-.2.3-.3.5-.3h1.6c.3 0 .5-.2.5-.5v-.4c0-1.3-.4-2.2-1.2-2.6-.6-.3-1.3-.4-2.1-.4h-.1c-.3 0-.5.2-.5.5v3.1c0 .3-.2.5-.5.5h-.4c-.3 0-.5-.2-.5-.5V8.5c0-.3-.2-.5-.5-.5h-.4c-.3 0-.5.2-.5.5v3.1c0 .3-.2.5-.5.5h-.4c-.3 0-.5-.2-.5-.5V8.5c0-.3-.2-.5-.5-.5h-.4c-.3 0-.5.2-.5.5v4.8c0 .8.3 1.6.9 2.1l2.2 2.4c.3.3.6.6 1 .6.4 0 .7-.3.7-.6v-.4c0-.2-.1-.4-.3-.6l-1.8-2.1c-.4-.5-.7-.9-.7-1.5 0-.3.2-.5.5-.5h1.1c.3 0 .5.2.5.5 0 .2 0 .3.1.4.3.5.6.9 1 1.4zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  `,
  },
  {
    value: 'WeChat',
    label: 'WeChat',
    icon: `
    <svg viewBox="0 0 24 24" class="w-full h-full text-[#09B83E]" fill="currentColor">
      <path d="M8.9 12.3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6.2 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 2.4.8 4.6 2.3 6.4L2 22l5.3-1.4c1.6.9 3.5 1.4 5.4 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.3-.4-4.8-1.2l-.4-.2-3.5.9.9-3.4-.2-.4C3.4 14.3 3 12.7 3 11c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"/>
    </svg>
  `,
  }]

  const getConflictLevel = (level: number) => {
    const levels = [
      '¡Genial! No tienes problemas',
      'Muy pocos conflictos',
      'Algunos desacuerdos ocasionales',
      'Tienes discusiones regularmente',
      'Muchos conflictos, reducelos',
      'Situación problemática, busca ayuda'
    ]
    return levels[level] || ''
  }

  const showSuccessModal = ref(false)

  const isFeminine = computed(() => formData.value.Gender === 'Femenino')
  const formWrapperClass = computed(() => isFeminine.value ? 'bg-gradient-to-br from-pink-100 via-rose-100 to-amber-50' : 'bg-gradient-to-br from-blue-100 via-indigo-100 to-cyan-50')
  const titleGradient = computed(() => isFeminine.value ? 'bg-gradient-to-r from-pink-500 to-rose-400' : 'bg-gradient-to-r from-blue-700 to-indigo-600')
  const accentText = computed(() => isFeminine.value ? 'text-pink-500' : 'text-blue-700')
  const borderAccent = computed(() => isFeminine.value ? 'border-pink-400' : 'border-blue-400')
  const borderAccentAlt = computed(() => isFeminine.value ? 'border-rose-400' : 'border-indigo-400')
  const cardClass = computed(() => 'bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50')
  const selectedBorder = computed(() => isFeminine.value ? 'border-pink-400 bg-pink-50' : 'border-blue-400 bg-blue-50')
  const defaultBorder = 'border-gray-200 hover:border-opacity-60'
  const focusAccent = computed(() => isFeminine.value ? 'focus:border-pink-400' : 'focus:border-cyan-400')
  const fillAccent = computed(() => isFeminine.value ? 'bg-pink-400' : 'bg-blue-400')
  const bubbleAccent = computed(() => isFeminine.value ? 'bg-gradient-to-r from-pink-200 to-rose-300' : 'bg-gradient-to-r from-blue-200 to-indigo-200')
  const gradientSlider = computed(() => isFeminine.value ? 'bg-gradient-to-r from-pink-100 to-rose-100' : 'bg-gradient-to-r from-indigo-100 to-blue-100')
  const textAccent = computed(() => isFeminine.value ? 'text-pink-600' : 'text-indigo-600')
  const sliderClass = computed(() => isFeminine.value ? 'bg-rose-200' : 'bg-white slider-unique')
  const buttonGradient = computed(() => isFeminine.value ? 'bg-gradient-to-r from-pink-500 via-rose-600 to-purple-700' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500')

  const getSleepComment = (h: number) => {
    if (h < 4) return 'Eso no es saludable 😴'
    if (h < 6) return 'Muy poco descanso'
    if (h < 8) return 'Podría ser mejor'
    if (h < 9) return 'Perfecto balance'
    return 'Eres un dormilón 😊'
  }

  const submitForm = () => {
    if (!validateForm()) {
      alert('Por favor, completa todos los campos requeridos.')
      return
    }

    formData.value.Avg_Daily_Usage_Hours = Math.round(Number(formData.value.Avg_Daily_Usage_Hours) * 10) / 10
    formData.value.Sleep_Hours_Per_Night = Math.round(Number(formData.value.Sleep_Hours_Per_Night) * 10) / 10
    formData.value.Mental_Health_Score = Math.round(Math.random() * 10)
    formData.value.Addicted_Score = Math.round(Math.random() * 10)

    // Guardar en localStorage
    const savedData = JSON.parse(localStorage.getItem('socialMediaData') || '[]')
    savedData.push({ ...formData.value, deleted: 0, timestamp: Date.now() })
    localStorage.setItem('socialMediaData', JSON.stringify(savedData))

    showSuccessModal.value = true

    // Resetear formulario
    formData.value = {
      Age: null,
      Gender: '',
      Academic_Level: '',
      Avg_Daily_Usage_Hours: 3,
      Most_Used_Platform: '',
      Affects_Academic_Performance: '',
      Sleep_Hours_Per_Night: 7,
      Mental_Health_Score: 0,
      Relationship_Status: '',
      Conflicts_Over_Social_Media: 0,
      Addicted_Score: 0
    }
  }

  return {
    formData,
    errors,
    genderOptions,
    academicOptions,
    relationshipOptions,
    platforms,
    getConflictLevel,
    isFeminine,
    formWrapperClass,
    titleGradient,
    accentText,
    borderAccent,
    borderAccentAlt,
    cardClass,
    selectedBorder,
    defaultBorder,
    focusAccent,
    fillAccent,
    bubbleAccent,
    gradientSlider,
    textAccent,
    sliderClass,
    buttonGradient,
    getSleepComment,
    submitForm,
    showSuccessModal
  }
}
