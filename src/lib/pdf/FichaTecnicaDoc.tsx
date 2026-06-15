import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const C = {
  dark: "#2B2018",
  gold: "#8B7535",
  white: "#FFFFFF",
  gray: "#F5F4F2",
  grayMid: "#6B6560",
  border: "#E8E4E0",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    paddingTop: 24,
    paddingBottom: 28,
    paddingLeft: 36,
    paddingRight: 36,
    fontFamily: "Helvetica",
    color: C.dark,
    fontSize: 9,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: C.gold,
  },

  // ── HEADER ──────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    marginTop: 10,
  },
  headerLeft: { flexDirection: "column" },
  logo: { width: 88, marginBottom: 5 },
  companyName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.dark, marginBottom: 2 },
  headerSmall: { fontSize: 7.5, color: C.grayMid, marginBottom: 1 },

  headerRight: { flexDirection: "column", alignItems: "flex-end" },
  contactLabel: { fontSize: 6.5, color: C.gold, fontFamily: "Helvetica-Bold", marginBottom: 5 },
  agentPhoto: { width: 48, height: 48, borderRadius: 24, marginBottom: 4, alignSelf: "flex-end" },
  agentName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.dark, textAlign: "right", marginBottom: 2 },

  divider: { borderBottomWidth: 1, borderBottomColor: C.gold, marginBottom: 10 },

  // ── TITLE ────────────────────────────────────────────────────────
  titleBlock: { marginBottom: 8 },
  operacion: { fontSize: 8, color: C.gold, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  titulo: { fontSize: 19, fontFamily: "Helvetica-Bold", color: C.dark, lineHeight: 1.2, marginBottom: 2 },
  ubicacionText: { fontSize: 8, color: C.grayMid },

  // ── PRICE ────────────────────────────────────────────────────────
  priceBlock: {
    backgroundColor: C.gray,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  priceLabel: { fontSize: 7, color: C.gold, fontFamily: "Helvetica-Bold", marginRight: 10 },
  priceValue: { fontSize: 17, fontFamily: "Helvetica-Bold", color: C.dark },

  // ── IMAGES ───────────────────────────────────────────────────────
  imagesRow: { flexDirection: "row", height: 165, marginBottom: 8 },
  imageMainWrap: { marginRight: 5 },
  imageMainImg: { width: "100%", height: "100%", objectFit: "cover" },
  imagesSecCol: { flex: 1, flexDirection: "column" },
  imageSec: { flex: 1, objectFit: "cover" },
  imageSecGap: { marginBottom: 5 },

  mapImage: { width: "100%", height: 95, objectFit: "cover", marginBottom: 8 },

  // ── SPECS GRID ───────────────────────────────────────────────────
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: C.border,
    borderLeftWidth: 1,
    borderLeftColor: C.border,
    marginBottom: 8,
  },
  specItem: {
    width: "25%",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: C.border,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  specLabel: { fontSize: 6.5, color: C.gold, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  specValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.dark },

  // ── SECONDARY ROW ────────────────────────────────────────────────
  secondaryRow: { flexDirection: "row", marginBottom: 10 },
  secChip: {
    backgroundColor: C.gray,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 8,
    flexDirection: "row",
  },
  secLabel: { fontSize: 7, color: C.grayMid, marginRight: 4 },
  secValue: { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.dark },

  // ── DESCRIPTION ──────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 7,
    color: C.gold,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    marginTop: 10,
  },
  descText: { fontSize: 8.5, color: C.grayMid, lineHeight: 1.55 },

  // ── AMENIDADES ───────────────────────────────────────────────────
  amenidadesRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  amenidadTag: {
    backgroundColor: C.gray,
    borderRadius: 2,
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginRight: 5,
    marginBottom: 5,
  },
  amenidadText: { fontSize: 7.5, color: C.dark },

  // ── FOOTER ───────────────────────────────────────────────────────
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  qrBlock: { alignItems: "center" },
  qrImage: { width: 56, height: 56, marginBottom: 3 },
  qrLabel: { fontSize: 6.5, color: C.grayMid, textAlign: "center" },
  footerSite: { fontSize: 7, color: C.grayMid, textAlign: "right" },

  // ── GALLERY PAGE ─────────────────────────────────────────────────
  galleryTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: C.dark, marginBottom: 12, marginTop: 10 },
  galleryGrid: { flexDirection: "row", flexWrap: "wrap" },
  galleryImage: { width: "49.5%", height: 170, objectFit: "cover", marginBottom: 6 },
  galleryImageLeft: { marginRight: "1%" },
});

export interface FichaTecnicaDocProps {
  titulo: string;
  subtitulo: string;
  ubicacionTexto: string;
  precio: string | null;
  notaPrecio: string;
  mostrarPrecio: boolean;
  imagenPortada: string;
  imagenes: string[];
  specs: Array<{ label: string; valor: string }>;
  mantenimiento: string | null;
  folio: string;
  descripcion: string;
  amenidades: string[] | null;
  qrDataUrl: string;
  mapDataUrl: string | null;
  logoBase64: string;
  albertoBase64: string | null;
  incluirContacto: boolean;
}

export default function FichaTecnicaDoc({
  titulo,
  subtitulo,
  ubicacionTexto,
  precio,
  notaPrecio,
  mostrarPrecio,
  imagenPortada,
  imagenes,
  specs,
  mantenimiento,
  folio,
  descripcion,
  amenidades,
  qrDataUrl,
  mapDataUrl,
  logoBase64,
  albertoBase64,
  incluirContacto,
}: FichaTecnicaDocProps) {
  const secImg1 = imagenes[0] ?? null;
  const secImg2 = imagenes[1] ?? null;
  const galleryImages = imagenes.slice(2);

  const priceText = mostrarPrecio && precio ? precio : notaPrecio;

  return (
    <Document>
      {/* ── PAGE 1: MAIN CONTENT ─────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.accentBar} />

        {/* HEADER */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Image src={logoBase64} style={s.logo} />
            <Text style={s.companyName}>BLAV Bienes Raíces</Text>
            <Text style={s.headerSmall}>Querétaro, Querétaro</Text>
            <Text style={s.headerSmall}>abarcenas@blav.com.mx</Text>
            <Text style={s.headerSmall}>+52 442 837 88 91</Text>
          </View>

          {incluirContacto && albertoBase64 && (
            <View style={s.headerRight}>
              <Text style={s.contactLabel}>ASESOR INMOBILIARIO</Text>
              <Image src={albertoBase64} style={s.agentPhoto} />
              <Text style={s.agentName}>Alberto Bárcenas Guevara</Text>
              <Text style={s.headerSmall}>abarcenas@blav.com.mx</Text>
              <Text style={s.headerSmall}>+52 442 837 88 91</Text>
            </View>
          )}
        </View>

        <View style={s.divider} />

        {/* TITLE */}
        <View style={s.titleBlock}>
          <Text style={s.operacion}>{subtitulo}</Text>
          <Text style={s.titulo}>{titulo}</Text>
          {ubicacionTexto ? <Text style={s.ubicacionText}>{ubicacionTexto}</Text> : null}
        </View>

        {/* PRICE */}
        <View style={s.priceBlock}>
          <Text style={s.priceLabel}>PRECIO</Text>
          <Text style={s.priceValue}>{priceText}</Text>
        </View>

        {/* IMAGES */}
        {(imagenPortada || secImg1) && (
          <View style={s.imagesRow}>
            {imagenPortada && (
              <View style={[{ flex: secImg1 ? 2 : 1 }, secImg1 ? s.imageMainWrap : {}]}>
                <Image src={imagenPortada} style={s.imageMainImg} />
              </View>
            )}
            {secImg1 && (
              <View style={s.imagesSecCol}>
                <Image
                  src={secImg1}
                  style={[s.imageSec, secImg2 ? s.imageSecGap : {}]}
                />
                {secImg2 && <Image src={secImg2} style={s.imageSec} />}
              </View>
            )}
          </View>
        )}

        {/* MAP */}
        {mapDataUrl && <Image src={mapDataUrl} style={s.mapImage} />}

        {/* SPECS */}
        {specs.length > 0 && (
          <View style={s.specsGrid}>
            {specs.map(({ label, valor }) => (
              <View key={label} style={s.specItem}>
                <Text style={s.specLabel}>{label.toUpperCase()}</Text>
                <Text style={s.specValue}>{valor}</Text>
              </View>
            ))}
          </View>
        )}

        {/* SECONDARY ROW: mantenimiento + folio */}
        <View style={s.secondaryRow}>
          {mantenimiento && (
            <View style={s.secChip}>
              <Text style={s.secLabel}>MANT. MENSUAL</Text>
              <Text style={s.secValue}>{mantenimiento}</Text>
            </View>
          )}
          <View style={s.secChip}>
            <Text style={s.secLabel}>FOLIO</Text>
            <Text style={s.secValue}>{folio}</Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        {descripcion && (
          <View>
            <Text style={s.sectionTitle}>DESCRIPCIÓN</Text>
            <Text style={s.descText}>{descripcion}</Text>
          </View>
        )}

        {/* AMENIDADES */}
        {amenidades && amenidades.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>DATOS COMPLEMENTARIOS</Text>
            <View style={s.amenidadesRow}>
              {amenidades.map((a) => (
                <View key={a} style={s.amenidadTag}>
                  <Text style={s.amenidadText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* FOOTER */}
        <View style={s.footer}>
          <View style={s.qrBlock}>
            <Image src={qrDataUrl} style={s.qrImage} />
            <Text style={s.qrLabel}>Escanea para ver en línea</Text>
          </View>
          <Text style={s.footerSite}>www.blav.com.mx</Text>
        </View>
      </Page>

      {/* ── GALLERY PAGES ────────────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <Page size="A4" style={s.page}>
          <View style={s.accentBar} />
          <Text style={s.galleryTitle}>Galería de imágenes</Text>
          <View style={s.galleryGrid}>
            {galleryImages.map((url, i) => (
              <Image
                key={i}
                src={url}
                style={[s.galleryImage, i % 2 === 0 ? s.galleryImageLeft : {}]}
              />
            ))}
          </View>
        </Page>
      )}
    </Document>
  );
}

export function createFichaTecnicaElement(props: FichaTecnicaDocProps) {
  return React.createElement(FichaTecnicaDoc, props);
}
