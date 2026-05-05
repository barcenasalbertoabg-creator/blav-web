import { client } from "@/../../sanity/lib/client";
import {
  ALL_ARTICULOS_QUERY,
  ARTICULO_BY_SLUG_QUERY,
  ALL_ARTICULO_SLUGS_QUERY,
} from "@/../../sanity/lib/queries";
import { resolveImageUrl } from "@/../../sanity/lib/image";
import { projectId } from "@/../../sanity/env";
import type { Articulo, CategoriaArticulo } from "@/types/articulo";

type SanityImageRaw = { urlExterna?: string | null; asset?: { url?: string; _id?: string } | null };
type SanityArticuloRaw = Omit<Articulo, "imagen_portada" | "seo"> & {
  imagenPortadaRaw: SanityImageRaw;
  seo: Omit<Articulo["seo"], "og_imagen"> & { ogImagenRaw: SanityImageRaw };
};

function normalizeArticulo(raw: SanityArticuloRaw): Articulo {
  return {
    ...raw,
    imagen_portada: resolveImageUrl(raw.imagenPortadaRaw),
    seo: {
      titulo:      raw.seo?.titulo      || raw.titulo,
      descripcion: raw.seo?.descripcion || raw.descripcion_corta,
      og_imagen:   resolveImageUrl(raw.seo?.ogImagenRaw) || resolveImageUrl(raw.imagenPortadaRaw),
    },
  };
}

function isSanityConfigured(): boolean {
  return !!projectId;
}

// ── Artículos de ejemplo (fallback mientras Sanity está vacío) ──────────────

const ARTICULOS_ESTATICOS: Articulo[] = [
  {
    slug: "como-elegir-zona-para-vivir-en-queretaro",
    titulo: "Cómo elegir una zona para vivir en Querétaro",
    categoria: "consejos" as CategoriaArticulo,
    descripcion_corta:
      "Querétaro tiene zonas muy distintas entre sí. Esta guía te ayuda a entender cuál se ajusta mejor a tu estilo de vida, presupuesto y necesidades cotidianas.",
    imagen_portada:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    fecha: "2026-01-15",
    tiempo_lectura: 5,
    seo: {
      titulo: "Cómo elegir una zona para vivir en Querétaro — BLAV",
      descripcion:
        "Guía práctica para entender Juriquilla, El Marqués, Sonterra, Centro y más. Elige la zona correcta según tu presupuesto y estilo de vida.",
      og_imagen: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    },
    contenido: `Querétaro es hoy una de las ciudades con mayor calidad de vida y crecimiento económico en México. Eso tiene un precio: la oferta inmobiliaria es amplia pero también variada, y elegir la zona correcta puede marcar una gran diferencia en tu día a día.

Antes de buscar propiedades, vale la pena hacerse algunas preguntas: ¿cuánto tiempo estás dispuesto a invertir en traslados? ¿Qué tan importante es estar cerca de escuelas o parques? ¿Prefieres un ambiente más urbano o más tranquilo? ¿Cuál es tu presupuesto mensual o de compra?

Juriquilla es quizás la zona más consolidada para familias con poder adquisitivo alto. Cuenta con escuelas privadas de calidad, acceso a la naturaleza, centros comerciales y excelente infraestructura. El precio por metro cuadrado es de los más altos de la ciudad, pero la demanda sigue siendo fuerte, lo que la convierte también en una zona de alta plusvalía.

El Marqués es una de las apuestas más interesantes en este momento. Es un municipio en plena expansión, con desarrollos residenciales bien planeados, cercanía a zonas industriales y precios más accesibles que Juriquilla. Ideal si buscas una propiedad nueva sin estirar demasiado el presupuesto.

Sonterra combina tranquilidad con acceso a servicios. Es una zona familiar bien consolidada, con zonas comerciales cercanas y buena conectividad hacia el corredor industrial. La oferta de casas usadas en Sonterra suele tener buena relación calidad-precio.

El Centro Histórico de Querétaro es Patrimonio de la Humanidad y tiene un mercado inmobiliario muy particular. Las propiedades aquí son ideales para renta turística o para quienes valoran vivir rodeados de arquitectura y cultura. Sin embargo, hay que revisar las restricciones que aplican en zonas protegidas antes de hacer cualquier modificación.

Corregidora es un municipio autónomo que ofrece mucho por su precio. Santa Cruz, El Pueblito y El Salitre son algunas de sus colonias más activas. La ventaja principal es el bajo impuesto predial y la rápida expansión de servicios.

El Libramiento Norponiente es la zona de desarrollo más reciente y de mayor perfil en la ciudad. Proyectos residenciales premium, clubes de golf y una apuesta clara por el segmento de lujo. Si buscas una propiedad de inversión o una residencia de alto nivel, esta zona tiene mucho potencial de plusvalía en los próximos años.

No existe una zona perfecta para todos. La clave es alinear la decisión con tu etapa de vida, tus hábitos cotidianos y tus objetivos financieros. En BLAV te ayudamos a encontrar la opción que realmente se adapta a ti, no solo a mostrarte lo que tenemos disponible.`,
  },
  {
    slug: "que-revisar-antes-de-rentar-una-propiedad",
    titulo: "Qué revisar antes de rentar una propiedad",
    categoria: "renta" as CategoriaArticulo,
    descripcion_corta:
      "Rentar parece sencillo, pero hay detalles clave que muchos inquilinos no revisan y que después se convierten en problemas. Aquí te decimos qué no puedes pasar por alto.",
    imagen_portada:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    fecha: "2026-02-10",
    tiempo_lectura: 4,
    seo: {
      titulo: "Qué revisar antes de rentar una propiedad — BLAV",
      descripcion:
        "Documentos, contrato, depósito, inventario y estado físico. Todo lo que debes revisar antes de firmar un contrato de arrendamiento.",
      og_imagen: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    },
    contenido: `La renta de una propiedad implica más que gustarte el espacio y negociar el precio. Antes de firmar cualquier contrato, hay una serie de elementos que deberías revisar con calma. Detectar un problema antes de rentar te puede ahorrar meses de complicaciones.

La documentación del inmueble es el primer punto. Solicita el predial reciente del dueño para confirmar que está pagado. Si hay adeudos de agua o de mantenimiento en condominio, asegúrate de que estén liquidados antes de que firmes. También es recomendable que el propietario te muestre que el inmueble no tiene juicios activos o hipotecas que pongan en riesgo la ocupación.

El contrato de arrendamiento es el documento más importante. Debe incluir: el precio mensual de renta, la forma y fecha de pago, el monto del depósito en garantía, las condiciones para hacer modificaciones al inmueble, quién paga qué servicios, y las condiciones para la rescisión anticipada. Evita contratos de una sola página; un buen contrato protege tanto al inquilino como al arrendador.

El depósito en garantía normalmente equivale a uno o dos meses de renta. Es importante que el contrato especifique en qué condiciones se devuelve y en cuánto tiempo. Si hay daños preexistentes en el inmueble, documéntalos fotográficamente antes de mudarte para no cargar con ellos al salir.

El inventario es algo que muchos inquilinos pasan por alto. Si la propiedad se renta amueblada o semi-amueblada, pide un inventario firmado de todo lo que está incluido: muebles, electrodomésticos, accesorios de cocina y baño. Esto te protege si hay disputas al momento de entregar.

Revisa el estado físico del inmueble con detalle: humedad en paredes o techo, funcionamiento del drenaje, estado de las instalaciones eléctricas e hidráulicas, ventanas y cerraduras, y el funcionamiento de todos los aparatos incluidos. Si algo no funciona bien, pide que lo corrijan antes de firmar o que lo descuenten del precio.

Pregunta también sobre el nivel de ruido en la zona y la seguridad del fraccionamiento o edificio. Esto es difícil de evaluar en una sola visita, pero puedes intentar hacer una visita en distintos horarios del día.

Con una revisión cuidadosa antes de firmar, la mayoría de los problemas comunes en arrendamiento se pueden evitar. En BLAV te acompañamos en todo el proceso: desde la búsqueda hasta la firma del contrato.`,
  },
  {
    slug: "como-evaluar-una-propiedad-de-inversion",
    titulo: "Cómo evaluar una propiedad de inversión",
    categoria: "inversion" as CategoriaArticulo,
    descripcion_corta:
      "No todas las propiedades son buenas inversiones. Estos indicadores clave te ayudan a decidir si el negocio tiene sentido en números y en contexto de mercado.",
    imagen_portada:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    fecha: "2026-03-05",
    tiempo_lectura: 6,
    seo: {
      titulo: "Cómo evaluar una propiedad de inversión — BLAV",
      descripcion:
        "Cap rate, plusvalía, flujo de caja y aspectos legales. Todo lo que necesitas analizar antes de comprar una propiedad como inversión.",
      og_imagen: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    },
    contenido: `Invertir en bienes raíces sigue siendo una de las formas más sólidas de preservar y hacer crecer el capital en México. Pero no toda propiedad es automáticamente una buena inversión. Antes de decidir, es indispensable analizar varios factores con frialdad, más allá de si el inmueble te gusta estéticamente.

El primero y más importante es la ubicación. En bienes raíces, la plusvalía —el incremento de valor en el tiempo— está directamente ligada a la zona. Áreas con crecimiento de infraestructura, nuevos desarrollos comerciales o mejoras en conectividad tienden a subir de valor. En Querétaro, zonas como el Libramiento Norponiente, El Marqués y Juriquilla han mostrado tasas de crecimiento sostenidas en los últimos años.

El rendimiento por renta es la métrica más clara para evaluar una inversión que generará flujo mensual. Se calcula dividiendo la renta mensual anualizada entre el precio de compra. Un inmueble que se compra en 3 millones y renta en 18,000 pesos mensuales genera un rendimiento bruto del 7.2% anual. En zonas de alta demanda de renta —cerca de hospitales, universidades o parques industriales— este indicador suele ser más alto.

El flujo de caja neto es lo que queda después de pagar mantenimiento, predial, seguros y posibles períodos de vacancia. Un error común es proyectar el rendimiento sin considerar estos gastos. Para propiedades en condominio, el mantenimiento puede ser significativo y debe incluirse en el análisis.

El tipo de propiedad importa. Los locales comerciales y bodegas industriales suelen tener contratos de arrendamiento más largos y estables que las residenciales, pero también requieren un inquilino más específico. Las propiedades residenciales cerca de zonas de alta demanda tienen menor vacancia y son más fáciles de administrar.

Si planeas apalancar la compra con crédito hipotecario, analiza si el flujo de renta cubre al menos la mensualidad del crédito. Un negocio donde el inquilino paga prácticamente el crédito mientras tú acumulas patrimonio es uno de los esquemas más eficientes en el largo plazo.

Los aspectos legales son no negociables. Verifica que el inmueble esté correctamente escriturado, que no tenga gravámenes y que esté al corriente en todos sus pagos. Una propiedad con problemas jurídicos puede convertirse en una fuente de gastos que anulen cualquier rendimiento.

Finalmente, considera tu horizonte de inversión. Si buscas liquidez a corto plazo, bienes raíces puede no ser el vehículo ideal. Pero si tienes un horizonte de 5 años o más, la combinación de plusvalía y rendimiento por renta puede ser muy difícil de igualar con otros instrumentos.

En BLAV analizamos contigo cada oportunidad con información real de mercado. No te vamos a decir que todo es buen negocio; te ayudamos a identificar las opciones que sí lo son.`,
  },
  {
    slug: "zonas-mayor-plusvalia-queretaro-2025",
    titulo: "Las zonas con mayor plusvalía en Querétaro 2025",
    categoria: "inversion" as CategoriaArticulo,
    descripcion_corta:
      "Querétaro sigue siendo una de las ciudades con mayor crecimiento de valor en México. Estas son las zonas que lideran la plusvalía en 2025 y por qué conviene tenerlas en el radar.",
    imagen_portada:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    fecha: "2025-03-10",
    tiempo_lectura: 6,
    seo: {
      titulo: "Zonas con mayor plusvalía en Querétaro 2025 — BLAV",
      descripcion:
        "Libramiento Norponiente, El Marqués, Juriquilla y más. Análisis de las zonas con mayor crecimiento de valor inmobiliario en Querétaro durante 2025.",
      og_imagen: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    },
    contenido: `Querétaro lleva más de una década siendo una de las ciudades con mayor dinamismo económico e inmobiliario de México. En 2025, ese crecimiento no se ha detenido, pero sí se ha concentrado en zonas específicas que ofrecen oportunidades claras para quienes buscan invertir con visión de largo plazo.

El Libramiento Norponiente es, sin duda, la zona de mayor atención este año. Este corredor vial que conecta la parte norte y poniente de la ciudad se ha convertido en el eje de los desarrollos residenciales de mayor plusvalía en Querétaro. La infraestructura vial de primer nivel, la proximidad a aeropuerto internacional y la llegada de proyectos residenciales de lujo —con campos de golf, amenidades exclusivas y accesos controlados— han generado una apreciación sostenida del suelo que supera el 15% anual en algunas zonas puntuales. Quien compró terreno o preventa en este corredor hace tres años hoy tiene una plusvalía significativa.

El Marqués es la apuesta más equilibrada entre rendimiento y accesibilidad. Como municipio autónomo con fuerte atracción industrial —Samsung, Toyota, Bombardier y docenas de empresas más tienen operaciones aquí—, la demanda de vivienda es constante y creciente. Los desarrollos residenciales en zonas como Cimatario, Zibatá y El Colorado han mostrado crecimientos anuales del 10 al 12% en valor de metro cuadrado, con alta demanda de renta por parte de ejecutivos y personal calificado de las plantas industriales. La combinación de demanda real de renta más plusvalía hace de El Marqués una de las zonas con mejor perfil de inversión en la región.

Juriquilla mantiene su estatus como zona premium consolidada. Aunque los precios ya son altos, la demanda se sostiene porque el inventario de propiedades de alta calidad es limitado y el perfil del comprador es solvente. Las casas en fraccionamientos cerrados de Juriquilla con alberca y campo de golf siguen siendo altamente cotizadas, y los tiempos de vacancia en renta son de los más cortos de la ciudad.

Corregidora, particularmente en colonias como Santa Cruz Nieto y El Pueblito, ha mostrado un comportamiento interesante: desarrollos de precio medio que capturan la demanda de familias jóvenes que buscan acceder a su primera propiedad sin alejarse demasiado de la ciudad. La infraestructura de servicios ha mejorado notablemente en los últimos dos años y la conectividad vial es cada vez mejor.

La zona norte de la ciudad, vinculada al corredor industrial del aeropuerto, también ha cobrado relevancia. Bodegas industriales, naves logísticas y locales comerciales en esta franja están experimentando una demanda inusualmente alta, impulsada por el crecimiento del comercio electrónico y la logística de última milla.

¿Qué significa esto para el inversionista individual? Que no es suficiente con comprar en Querétaro; hay que comprar en la zona correcta, con la tipología correcta y con el horizonte de tiempo adecuado. En BLAV te ayudamos a analizar cada oportunidad con datos reales, no con entusiasmo comercial. Si estás considerando una inversión en 2025, es buen momento para hacer números con alguien que conoce el mercado desde adentro.`,
  },
  {
    slug: "guia-rentar-local-comercial-queretaro",
    titulo: "Guía para rentar un local comercial en Querétaro",
    categoria: "renta" as CategoriaArticulo,
    descripcion_corta:
      "Rentar un local comercial en Querétaro implica más que encontrar el espacio adecuado. Esta guía cubre todo lo que necesitas saber antes de firmar un contrato.",
    imagen_portada:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    fecha: "2025-02-18",
    tiempo_lectura: 5,
    seo: {
      titulo: "Guía para rentar un local comercial en Querétaro — BLAV",
      descripcion:
        "Contrato, fianza, aforo, zonificación y más. Todo lo que debes revisar antes de rentar un local comercial en Querétaro para tu negocio.",
      og_imagen: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    },
    contenido: `Abrir un negocio propio es una de las decisiones más importantes que puede tomar una persona. Y dentro de esa decisión, elegir el local comercial correcto puede ser la diferencia entre el éxito y el cierre en el primer año. En Querétaro, el mercado de locales comerciales es dinámico y competitivo. Aquí te explicamos qué debes tener en cuenta antes de firmar cualquier contrato.

Lo primero que debes definir es el uso de suelo. No todos los inmuebles en Querétaro están autorizados para todos los giros comerciales. Un local que visualmente parece perfecto para un restaurante puede no tener la licencia de uso de suelo correspondiente, lo que implicaría meses de trámites y gastos adicionales antes de poder operar. Antes de avanzar con cualquier negociación, solicita al propietario o al municipio la constancia de uso de suelo y verifica que el giro que planeas sea compatible.

El aforo y la distribución del espacio deben analizarse con frialdad. Es fácil enamorarse de un local porque tiene buena ubicación o una fachada llamativa, pero si el diseño interior no se adapta a tu flujo operativo, necesitarás invertir en obra que puede encarecer significativamente tu arranque. Mide el espacio, imagina cómo operaría tu negocio dentro y, si es posible, habla con alguien que ya tenga experiencia en el giro.

La visibilidad y el tráfico peatonal o vehicular son variables clave para negocios que dependen de clientes de paso. Un local en plaza comercial tiene ventajas de flujo garantizado pero rentas más altas y condiciones de contrato más rígidas. Un local en calle puede ser más económico pero exige mayor inversión en señalización y atracción de clientes. No hay una respuesta universal: depende del modelo de negocio.

El contrato de arrendamiento comercial debe revisarse con mucho cuidado. A diferencia de los contratos residenciales, los contratos comerciales suelen ser a plazos más largos —mínimo un año, frecuentemente tres o más— y las condiciones de rescisión pueden ser onerosas. Verifica: el plazo y las condiciones de renovación, quién paga el mantenimiento de áreas comunes si es en plaza, las restricciones sobre modificaciones al inmueble, los términos de la fianza o aval, y las condiciones de incremento de renta anual.

La fianza o garantía es otro punto a negociar. En muchos casos los propietarios solicitan entre dos y tres meses de renta como depósito, más un aval o fianza bancaria. Si no cuentas con un aval con propiedades en Querétaro, existen alternativas como el seguro de caución o fianza de arrendamiento comercial que pueden facilitar el proceso.

En cuanto a zonas, Querétaro tiene opciones para todos los presupuestos. Las plazas comerciales en Juriquilla y el corredor del Tecnológico tienen rentas elevadas pero flujo garantizado. El Centro Histórico es excelente para negocios con identidad de marca y turismo, aunque las restricciones de modificaciones al inmueble pueden ser mayores. El Marqués y Corregidora ofrecen rentas más competitivas con buena densidad poblacional y creciente demanda.

En BLAV trabajamos con propietarios de locales comerciales en múltiples zonas de Querétaro. Si estás buscando el espacio correcto para tu negocio, cuéntanos qué necesitas y te ayudamos a encontrar la opción que más se adapta a tu operación y presupuesto.`,
  },
  {
    slug: "conviene-mas-comprar-o-rentar-queretaro",
    titulo: "¿Conviene más comprar o rentar en Querétaro?",
    categoria: "consejos" as CategoriaArticulo,
    descripcion_corta:
      "La respuesta depende de tu momento de vida, tus finanzas y tus planes a futuro. Aquí analizamos los factores reales para tomar la mejor decisión en el mercado queretano.",
    imagen_portada:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    fecha: "2025-01-22",
    tiempo_lectura: 5,
    seo: {
      titulo: "¿Conviene más comprar o rentar en Querétaro? — BLAV",
      descripcion:
        "Análisis honesto de cuándo conviene comprar y cuándo rentar en Querétaro, considerando plusvalía, tasas hipotecarias, movilidad y etapa de vida.",
      og_imagen: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    },
    contenido: `Es una de las preguntas más frecuentes que recibimos en BLAV, y también una de las más difíciles de responder de forma genérica, porque la respuesta correcta depende de factores muy personales. Dicho eso, hay elementos objetivos que ayudan a orientar la decisión.

Primero, lo que no es correcto: decir que rentar es "tirar el dinero". Esta frase ignora que cuando compras con crédito hipotecario, una parte significativa de tus primeros años de pagos se va a intereses, no a construir patrimonio real. También ignora los costos de mantenimiento, predial, seguros y los gastos de adquisición que implica comprar. Rentar tiene un costo, sí, pero también tiene valor: flexibilidad, previsibilidad de gasto mensual y cero responsabilidad sobre el mantenimiento del inmueble.

Cuando conviene comprar: Si tienes un horizonte de permanencia de al menos 5 a 7 años en la misma ciudad, un empleo estable y un enganche del 20% o más del valor del inmueble, la compra suele ser la decisión financieramente más sólida en Querétaro. La plusvalía acumulada en ese período —especialmente en zonas como el Libramiento Norponiente, Juriquilla o El Marqués— suele superar con creces los costos de transacción y los intereses pagados. Además, construyes patrimonio y te liberas de la dependencia de un arrendador.

La tasa hipotecaria importa más de lo que muchos creen. En México, las tasas de crédito hipotecario oscilan entre el 9% y el 12% anual dependiendo del banco y el perfil del acreditado. A tasas altas, el costo financiero de comprar se encarece significativamente. En este contexto, si puedes dar un enganche mayor, el crédito se vuelve más manejable y el punto de equilibrio entre comprar y rentar se alcanza antes.

Cuando conviene rentar: Si acabas de llegar a Querétaro y no conoces bien la ciudad, rentar te da tiempo para entender qué zona se adapta mejor a tu estilo de vida sin comprometerte con una compra que podrías lamentar. También conviene rentar si tu situación laboral o familiar está en transición: un cambio de trabajo, un proyecto de vida internacional o planes de formar familia pueden alterar completamente tus necesidades de espacio y ubicación en el corto plazo.

El mercado de renta en Querétaro tiene buena oferta, especialmente en segmentos medios y residenciales. Los precios han subido en los últimos años —consecuencia del mismo crecimiento que hace atractiva la ciudad—, pero siguen siendo competitivos frente a Ciudad de México o Monterrey.

Una estrategia que funciona bien para algunos clientes es rentar mientras construyen el enganche suficiente para comprar en mejores condiciones. En lugar de comprar apresuradamente con lo mínimo, esperan dos o tres años, ahorran, conocen la ciudad y entran al mercado con mayor poder de negociación.

En BLAV no tenemos un interés en que compres o rentes: tenemos interés en que tomes la mejor decisión para tu situación. Si quieres analizar números reales con base en tu ingreso, tus ahorros y tus planes, podemos ayudarte a hacer ese ejercicio sin compromiso.`,
  },
  {
    slug: "libramiento-norponiente-queretaro-inversion",
    titulo: "Qué es el Libramiento Norponiente y por qué importa para invertir",
    categoria: "inversion" as CategoriaArticulo,
    descripcion_corta:
      "El Libramiento Norponiente es el desarrollo vial más importante de Querétaro en la última década. Entender por qué transforma el mercado inmobiliario es clave para invertir bien.",
    imagen_portada:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    fecha: "2024-12-05",
    tiempo_lectura: 6,
    seo: {
      titulo: "Libramiento Norponiente de Querétaro: guía para inversión inmobiliaria — BLAV",
      descripcion:
        "Todo sobre el Libramiento Norponiente de Querétaro: qué es, qué zonas conecta, qué proyectos inmobiliarios hay y por qué es la zona de mayor plusvalía en la ciudad.",
      og_imagen: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    },
    contenido: `Si llevas tiempo siguiendo el mercado inmobiliario de Querétaro, habrás escuchado hablar del Libramiento Norponiente. Si apenas estás empezando a explorar oportunidades de inversión en la ciudad, este es probablemente el concepto más importante que debes entender.

El Libramiento Norponiente es una vialidad de primer nivel que conecta la zona norte y la zona poniente de Querétaro, bordeando la ciudad por su parte más nueva y de mayor crecimiento. Su trazo va desde las inmediaciones del aeropuerto internacional hacia la Carretera a Celaya, pasando por zonas que hasta hace poco eran prácticamente rurales y que hoy se han transformado en los desarrollos residenciales más cotizados de la región.

La lógica es simple: cuando una vialidad de esta magnitud se construye, el suelo aledaño se valoriza. La conectividad genera accesibilidad, la accesibilidad genera demanda, y la demanda empuja los precios hacia arriba. Esto es algo que los inversionistas inmobiliarios más experimentados saben bien: comprar cerca de infraestructura en etapa temprana es una de las estrategias de mayor retorno en el largo plazo.

¿Qué hay en el corredor del Libramiento Norponiente hoy? Varios de los proyectos residenciales de mayor perfil en Querétaro: fraccionamientos cerrados con amenidades de club —campos de golf, albercas olímpicas, canchas de tenis, seguridad privada—, desarrollos de casas en preventa con precios todavía accesibles frente a lo que será su valor en tres o cinco años, y algunos desarrollos de uso mixto con locales comerciales y oficinas que buscan servir a la creciente población de la zona.

El perfil del comprador en esta zona también ha cambiado. Antes era casi exclusivamente querétaro local o inversionistas del Bajío. Hoy llegan compradores de Ciudad de México, Guadalajara y del extranjero que identifican en Querétaro —y específicamente en esta zona— una oportunidad de compra que en sus ciudades de origen ya no existe a estos precios.

Para el inversionista, las oportunidades más relevantes son dos: preventa residencial y terrenos. Las preventas en esta zona suelen ofrecer precios de lanzamiento significativamente por debajo del valor proyectado al momento de la entrega. Es un esquema que funciona bien si el desarrollador tiene trayectoria y el proyecto está bien ubicado. Los terrenos en zonas aún no desarrolladas del corredor tienen mayor riesgo —requieren más tiempo y certeza sobre los permisos y la infraestructura— pero también mayor upside si se materializan los proyectos.

¿Cuánto ha subido el valor en esta zona? Algunos corredores específicos han visto incrementos de entre el 12% y el 18% anual en los últimos tres años. No es una garantía de comportamiento futuro, pero refleja la tendencia de fondo: Querétaro sigue creciendo, y el Libramiento Norponiente es su punto de expansión más activo.

En BLAV tenemos operaciones en esta zona y conocemos los proyectos activos, sus desarrolladores y sus condiciones reales. Si te interesa explorar oportunidades en el Libramiento Norponiente, podemos orientarte con información de primera mano y sin sesgos comerciales.`,
  },
];

export async function getAllArticulos(): Promise<Articulo[]> {
  if (!isSanityConfigured()) return ARTICULOS_ESTATICOS;
  try {
    const raw: SanityArticuloRaw[] = await client.fetch(ALL_ARTICULOS_QUERY);
    if (!raw || raw.length === 0) return ARTICULOS_ESTATICOS;
    return raw.map(normalizeArticulo);
  } catch {
    return ARTICULOS_ESTATICOS;
  }
}

export async function getArticuloBySlug(slug: string): Promise<Articulo | null> {
  const estatico = ARTICULOS_ESTATICOS.find((a) => a.slug === slug);
  if (!isSanityConfigured()) return estatico ?? null;
  try {
    const raw: SanityArticuloRaw | null = await client.fetch(ARTICULO_BY_SLUG_QUERY, { slug });
    if (!raw) return estatico ?? null;
    return normalizeArticulo(raw);
  } catch {
    return estatico ?? null;
  }
}

export async function getArticuloSlugs(): Promise<string[]> {
  const staticSlugs = ARTICULOS_ESTATICOS.map((a) => a.slug);
  if (!isSanityConfigured()) return staticSlugs;
  try {
    const slugs: (string | null)[] = await client.fetch(ALL_ARTICULO_SLUGS_QUERY);
    const sanitySlugs = (slugs ?? []).filter((s): s is string => !!s);
    return sanitySlugs.length > 0 ? sanitySlugs : staticSlugs;
  } catch {
    return staticSlugs;
  }
}
