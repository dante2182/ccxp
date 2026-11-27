export type Theme = "light" | "dark";

export type Service = {
  id: string;
  slug: string;
  icon: "telecom" | "network" | "security" | "energy";
  title: string;
  short: string;
  description: string;
  items: string[];
  tag: string;
};

export const SERVICES: Service[] = [
  {
    id: "telecomunicaciones",
    slug: "Telecomunicaciones",
    icon: "telecom",
    title: "Telecomunicaciones",
    short: "Enlaces de voz y datos de alta disponibilidad para operadores, empresas y el Estado.",
    description:
      "Diseñamos y desplegamos enlaces de voz y datos de alta disponibilidad para operadores, empresas y el Estado.",
    items: [
      "Fibra óptica (FTTH y enlaces troncales)",
      "Antenas 4G / 5G",
      "Radioenlaces punto a punto",
      "Torres de comunicación",
    ],
    tag: "Conectividad crítica",
  },
  {
    id: "redes",
    slug: "Redes y telemática",
    icon: "network",
    title: "Redes y Telemática",
    short: "Infraestructura de red certificada y protegida para operaciones críticas de su negocio.",
    description: "Infraestructura de red certificada y protegida para las operaciones críticas de su negocio.",
    items: [
      "Cableado estructurado",
      "Centrales telefónicas (IP-PBX)",
      "Routing & switching",
      "Seguridad TI y firewalls",
    ],
    tag: "Redes que no fallan",
  },
  {
    id: "seguridad",
    slug: "Seguridad electrónica",
    icon: "security",
    title: "Seguridad Electrónica",
    short: "Protección integral de instalaciones con tecnología de videovigilancia y detección.",
    description: "Protección integral de instalaciones con tecnología de videovigilancia y detección inteligente.",
    items: [
      "Videovigilancia CCTV / IP",
      "Alarmas contra incendios",
      "Control de accesos",
      "Detección de intrusos",
    ],
    tag: "Tranquilidad operativa",
  },
  {
    id: "energia",
    slug: "Energía eléctrica",
    icon: "energy",
    title: "Energía Eléctrica",
    short: "Sistemas eléctricos seguros y normalizados para continuidad operativa garantizada.",
    description: "Sistemas eléctricos seguros y normalizados para una continuidad operativa garantizada.",
    items: [
      "Puestas a tierra y pararrayos",
      "Tableros eléctricos",
      "Subestaciones",
      "Bancos de baterías (UPS)",
    ],
    tag: "Continuidad 24/7",
  },
];

export type Capability = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  metrics: { value: string; label: string }[];
  image: string;
  imageAlt: string;
};

export const CAPABILITIES: Capability[] = [
  {
    id: "fibra",
    label: "Fibra óptica",
    eyebrow: "Backbone de nueva generación",
    title: "Fibra certificada de extremo a extremo.",
    description:
      "Tendemos, fusionamos y certificamos fibra óptica con protocolos que no dejan nada al azar. Cada empalme, cada curva y cada enlace queda documentado para auditoría.",
    bullets: [
      "Certificación OTDR y Fluke Networks por tramo",
      "Empalmes por fusión con pérdida controlada",
      "Diseño de rutas y redundancia de última milla",
    ],
    metrics: [
      { value: "≤ 0.15 dB", label: "pérdida por empalme" },
      { value: "100 Gbps", label: "capacidad de transporte" },
      { value: "99,99 %", label: "disponibilidad de enlace" },
    ],
    image:
      "https://images.pexels.com/photos/4425157/pexels-photo-4425157.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    imageAlt: "Patch panel de fibra óptica con cables azules en un rack de comunicaciones",
  },
  {
    id: "5g",
    label: "5G & Wireless",
    eyebrow: "Ingeniería de radiofrecuencia",
    title: "Cobertura diseñada, no improvisada.",
    description:
      "Estudiamos el espectro, calculamos la propagación y desplegamos la antena correcta donde realmente se necesita. Radioenlaces y 5G con capacidad para crecer.",
    bullets: [
      "Site survey y planificación RF con software especializado",
      "Instalación de antenas, torres y radioenlaces troncales",
      "Optimización y monitoreo de cobertura en campo",
    ],
    metrics: [
      { value: "± 2 dB", label: "precisión de diseño RF" },
      { value: "34+", label: "sitios desplegados" },
      { value: "24/7", label: "monitoreo de enlaces" },
    ],
    image:
      "https://images.pexels.com/photos/9290878/pexels-photo-9290878.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    imageAlt: "Torre de telecomunicaciones con antenas y parabólicas",
  },
  {
    id: "seguridad",
    label: "Seguridad IP",
    eyebrow: "Vigilancia con inteligencia",
    title: "Ver para decidir, a tiempo.",
    description:
      "Sistemas de videovigilancia IP y control de accesos que se integran en una sola plataforma. Analítica en el borde, grabación redundante y acceso desde cualquier sede.",
    bullets: [
      "Cámaras IP con analítica de video incorporada",
      "Control de accesos y detección perimetral integrada",
      "Protocolos de retención y ciberseguridad",
    ],
    metrics: [
      { value: "4K", label: "resolución por canal" },
      { value: "30 días", label: "grabación redundante" },
      { value: "98 %", label: "reducción de falsas alarmas" },
    ],
    image:
      "https://images.pexels.com/photos/19782580/pexels-photo-19782580.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    imageAlt: "Cámaras de videovigilancia instaladas frente a un edificio corporativo",
  },
  {
    id: "energia",
    label: "Energía & UPS",
    eyebrow: "Continuidad operativa",
    title: "La red no se detiene cuando la energía sí.",
    description:
      "Puestas a tierra, pararrayos, tableros y respaldo con baterías calculados según su carga crítica. Protegemos los equipos que sostienen tu operación.",
    bullets: [
      "Estudio de resistividad y malla de puesta a tierra",
      "Tableros y subestaciones bajo normativa CNE",
      "UPS y respaldo dimensionado según autonomía requerida",
    ],
    metrics: [
      { value: "< 5 Ω", label: "resistencia de puesta a tierra" },
      { value: "0 ms", label: "transferencia a respaldo" },
      { value: "CNE", label: "cumplimiento normativo" },
    ],
    image:
      "https://images.pexels.com/photos/14319099/pexels-photo-14319099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    imageAlt: "Técnico verificando un tablero eléctrico industrial con multímetro",
  },
];

export type Post = {
  id: string;
  category: string;
  categoryIcon: "telecom" | "security" | "energy";
  title: string;
  excerpt: string;
  date: string;
  iso: string;
  readTime: string;
  body: { heading?: string; text: string; list?: string[] }[];
};

export const POSTS: Post[] = [
  {
    id: "fibra-5g",
    category: "Telecomunicaciones",
    categoryIcon: "telecom",
    title: "Fibra óptica y 5G: la red que prepara a su empresa para la próxima década",
    excerpt:
      "El despliegue 5G en el Perú exige infraestructura de fibra óptica certificada. Analizamos por qué la fibra es la base del 5G y qué debe evaluar antes de migrar.",
    date: "12 de noviembre de 2026",
    iso: "2026-11-12",
    readTime: "5 min de lectura",
    body: [
      {
        text: "La discusión sobre 5G suele centrarse en la antena. Pero el rendimiento real de una red móvil de quinta generación depende, casi por completo, de lo que ocurre detrás de ella: el transporte de fibra óptica. Sin un backhaul robusto, ninguna antena puede entregar la latencia y el ancho de banda que promete.",
      },
      {
        heading: "1. La antena no es el cuello de botella",
        text: "Cada sitio 5G necesita transportar varios gigabits por segundo hacia el núcleo de la red. Un enlace de radio mal dimensionado convierte una promesa de 1 Gbps en una experiencia de 80 Mbps en horas de mayor demanda. Antes de comprar equipos 5G, audite el enlace.",
      },
      {
        heading: "2. Certificación: lo que no se mide, no existe",
        text: "Un tendido de fibra sin certificación es una factura pendiente. Exigimos pruebas bidireccionales de pérdida de inserción, reflectometría OTDR y presupuesto óptico documentado para cada tramo. Es la única forma de garantizar capacidad futura.",
        list: [
          "Presupuesto óptico calculado y validado por tramo",
          "Certificación de cada empalme por fusión",
          "Rutas alternas para los enlaces considerados críticos",
        ],
      },
      {
        heading: "3. Migre por etapas, no por moda",
        text: "La ruta recomendada es ordenar la base: fibra certificada, switching con capacidad de reserva y segmentación lógica. Luego habilite 5G privado o fijo inalámbrico para los casos de uso que generan valor real, como logística, minería o videovigilancia remota.",
      },
    ],
  },
  {
    id: "videovigilancia-empresarial",
    category: "Seguridad Electrónica",
    categoryIcon: "security",
    title: "Videovigilancia empresarial: de las cámaras aisladas a la seguridad inteligente",
    excerpt:
      "Las cámaras solas ya no bastan. Los sistemas de videovigilancia modernos integran analítica con IA, control de accesos y detección de intrusos en una sola plataforma.",
    date: "3 de noviembre de 2026",
    iso: "2026-11-03",
    readTime: "4 min de lectura",
    body: [
      {
        text: "Una cámara conectada no es un sistema de seguridad. Es un sensor. El valor aparece cuando ese sensor se integra con el control de accesos, la detección perimetral y un protocolo de respuesta claro. Ese es el punto de partida de cualquier proyecto serio.",
      },
      {
        heading: "Analítica en el borde",
        text: "Procesar el video dentro de la cámara reduce tráfico de red y permite detectar situaciones en tiempo real: cruce de perímetro, objetos abandonados, aglomeraciones. Además, la información sensible no necesita salir de la instalación.",
      },
      {
        heading: "Diseñe el sistema alrededor de la operación",
        text: "Antes de elegir resoluciones y lentes, definimos qué eventos deben generar una alerta y quién responde a ellos. Documentamos los flujos de atención y los roles con acceso al video.",
        list: [
          "Mapa de puntos críticos y cobertura sin ángulos muertos",
          "Retención y cifrado según criticidad de la información",
          "Integración con alarma de intrusos y control de puertas",
        ],
      },
      {
        heading: "Ciberseguridad desde el primer día",
        text: "Cámaras con contraseñas de fábrica y firmware sin actualizar son una puerta abierta. Segmentación de red (VLAN), actualizaciones programadas y monitoreo de dispositivos son requisitos, no extras.",
      },
    ],
  },
  {
    id: "proteccion-electrica",
    category: "Energía Eléctrica",
    categoryIcon: "energy",
    title: "Protección eléctrica industrial: puesta a tierra, pararrayos y respaldo de energía",
    excerpt:
      "Un sistema de puesta a tierra deficiente destruye equipos de decenas de miles de dólares. Revisamos las 3 protecciones que toda planta industrial debe tener.",
    date: "21 de octubre de 2026",
    iso: "2026-10-21",
    readTime: "6 min de lectura",
    body: [
      {
        text: "La continuidad eléctrica no se resuelve únicamente con un UPS. Existe una cadena de protección que empieza en la tierra física y termina en el respaldo. Si un eslabón falla, los equipos críticos quedan expuestos aunque exista respaldo.",
      },
      {
        heading: "1. Puesta a tierra medida, no estimada",
        text: "Una malla de aterramiento debe calcularse con la resistividad real del terreno. Los valores objetivo cambian según el equipo y la norma aplicable. Medimos y documentamos la resistencia antes y después de la intervención.",
        list: [
          "Medición de resistividad con método Wenner",
          "Diseño de pozo y malla según carga y norma",
          "Verificación periódica del sistema completo",
        ],
      },
      {
        heading: "2. Protección contra descargas atmosféricas",
        text: "Los pararrayos deben integrarse con el sistema de tierra y con los protectores de sobretensión de los tableros y de las líneas de datos. Un pararrayos sin coordinación puede derivar la descarga hacia la red de telecomunicaciones.",
      },
      {
        heading: "3. Respaldo dimensionado con criterio",
        text: "Un banco de baterías o una UPS se dimensiona por carga crítica y autonomía requerida, no por tamaño del tablero. Calculamos la proyección de crecimiento para evitar sobrecostos y falsas seguridades.",
      },
    ],
  },
];

export const TRUST_CLIENTS = [
  "Operadores de telecomunicaciones",
  "Minería y gran industria",
  "Gobiernos regionales",
  "Salud y clínicas",
  "Educación superior",
  "Banca y retail",
];

export const STATS = [
  { value: "12+", label: "años de experiencia", detail: "desde 2014" },
  { value: "480+", label: "proyectos ejecutados", detail: "en 9 regiones" },
  { value: "99,99%", label: "disponibilidad de red", detail: "monitoreo 24/7" },
  { value: "18", label: "ingenieros certificados", detail: "equipo en campo" },
];

export const PROCESS = [
  {
    step: "01",
    title: "Diagnóstico",
    text: "Visitamos la sede, medimos la infraestructura existente y levantamos los requerimientos reales de su operación.",
  },
  {
    step: "02",
    title: "Diseño",
    text: "Entregamos planos, memoria de cálculo, especificación de equipos y cronograma con presupuesto cerrado.",
  },
  {
    step: "03",
    title: "Implementación",
    text: "Ejecutamos con protocolos de seguridad, supervisión permanente y mínima interrupción de su operación.",
  },
  {
    step: "04",
    title: "Certificación",
    text: "Certificamos cada tramo, documentamos la instalación y capacitamos al equipo para el soporte continuo.",
  },
];

export const CONTACT = {
  address: "Calle Peral 119, Cercado, Arequipa, Perú",
  phone: "+51 959 829 143",
  phoneHref: "+51959829143",
  email: "ventas@ccip.com.pe",
  hours: "Lunes a viernes, 8:00 – 18:00",
  whatsapp:
    "https://wa.me/51959829143?text=Hola%20CCIP%2C%20quisiera%20conversar%20sobre%20un%20proyecto%20de%20infraestructura.",
};
