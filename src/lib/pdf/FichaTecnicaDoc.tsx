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

// ── Layout constants (A4 portrait = 595×842 pt, padding 36 each side) ──────
const CW = 595 - 36 - 36; // 523 pt — usable content width

// Page 1 image row
const ROW_H = 158;
const IMG_GAP = 5;
const MAIN_W = Math.round((CW - IMG_GAP) * (2 / 3)); // ~345 pt
const SEC_W = CW - MAIN_W - IMG_GAP;                  // ~173 pt
const SEC_GAP = 5;
const SEC_H = Math.floor((ROW_H - SEC_GAP) / 2);      // ~76 pt

// Gallery page
const GAL_GAP = 6;
const GAL_W = Math.floor((CW - GAL_GAP) / 2); // ~258 pt
const GAL_H = 155;

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
  secondaryRow: { flexDirection: "row", marginBottom: 8 },
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
    marginTop: 6,
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

  // ── GALLERY PAGE ─────────────────────────────────────────────────
  galleryTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    marginBottom: 12,
    marginTop: 10,
  },
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
  const galleryRows: [string, string | null][] = [];
  for (let i = 0; i < galleryImages.length; i += 2) {
    galleryRows.push([galleryImages[i], galleryImages[i + 1] ?? null]);
  }

  const priceText = mostrarPrecio && precio ? precio : notaPrecio;

  // Footer height estimate (used to reserve bottom space when incluirContacto=true)
  const FOOTER_H = 80;

  return (
    <Document>
      {/* ── PAGE 1: MAIN CONTENT ──────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.accentBar} />

        {/* HEADER — entirely absent when contacto=false */}
        {incluirContacto && (
          <View style={s.header}>
            <View style={s.headerLeft}>
              <Image src={logoBase64} style={s.logo} />
              <Text style={s.companyName}>BLAV Bienes Raíces</Text>
              <Text style={s.headerSmall}>Querétaro, Querétaro</Text>
              <Text style={s.headerSmall}>abarcenas@blav.com.mx</Text>
              <Text style={s.headerSmall}>+52 442 837 88 91</Text>
            </View>

            {albertoBase64 && (
              <View style={s.headerRight}>
                <Text style={s.contactLabel}>ASESOR INMOBILIARIO</Text>
                <Image src={albertoBase64} style={s.agentPhoto} />
                <Text style={s.agentName}>Alberto Bárcenas Guevara</Text>
                <Text style={s.headerSmall}>abarcenas@blav.com.mx</Text>
                <Text style={s.headerSmall}>+52 442 837 88 91</Text>
              </View>
            )}
          </View>
        )}

        {incluirContacto && <View style={s.divider} />}

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

        {/* IMAGES — objectFit:"contain" shows full image; gray bg provides letterbox color */}
        {(imagenPortada || secImg1) && (
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            {imagenPortada && (
              <View
                style={{
                  width: secImg1 ? MAIN_W : CW,
                  height: ROW_H,
                  backgroundColor: C.gray,
                  marginRight: secImg1 ? IMG_GAP : 0,
                }}
              >
                <Image
                  src={imagenPortada}
                  style={{ width: secImg1 ? MAIN_W : CW, height: ROW_H, objectFit: "contain" }}
                />
              </View>
            )}
            {secImg1 && (
              <View style={{ flexDirection: "column" }}>
                <View
                  style={{
                    width: SEC_W,
                    height: SEC_H,
                    backgroundColor: C.gray,
                    marginBottom: secImg2 ? SEC_GAP : 0,
                  }}
                >
                  <Image src={secImg1} style={{ width: SEC_W, height: SEC_H, objectFit: "contain" }} />
                </View>
                {secImg2 && (
                  <View style={{ width: SEC_W, height: SEC_H, backgroundColor: C.gray }}>
                    <Image src={secImg2} style={{ width: SEC_W, height: SEC_H, objectFit: "contain" }} />
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* MAP */}
        {mapDataUrl && (
          <Image
            src={mapDataUrl}
            style={{ width: CW, height: 72, objectFit: "cover", marginBottom: 8 }}
          />
        )}

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

        {/* Reserve bottom space so content never overlaps the absolute footer */}
        {incluirContacto && <View style={{ height: FOOTER_H }} />}

        {/* FOOTER — absolutely positioned at page bottom; never flows to a new page */}
        {incluirContacto && (
          <View
            style={{
              position: "absolute",
              bottom: 28,
              left: 36,
              right: 36,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingTop: 6,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image src={qrDataUrl} style={{ width: 56, height: 56, marginBottom: 3 }} />
              <Text style={{ fontSize: 6.5, color: C.grayMid, textAlign: "center" }}>
                Escanea para ver en línea
              </Text>
            </View>
            <Text style={{ fontSize: 7, color: C.grayMid, textAlign: "right" }}>
              www.blav.com.mx
            </Text>
          </View>
        )}
      </Page>

      {/* ── GALLERY PAGE ─────────────────────────────────────────────── */}
      {galleryRows.length > 0 && (
        <Page size="A4" style={s.page}>
          <View style={s.accentBar} />
          <Text style={s.galleryTitle}>Galería de imágenes</Text>
          {galleryRows.map(([left, right], rowIdx) => (
            <View
              key={rowIdx}
              style={{ flexDirection: "row", marginBottom: GAL_GAP }}
            >
              <View
                style={{
                  width: GAL_W,
                  height: GAL_H,
                  backgroundColor: C.gray,
                  marginRight: right ? GAL_GAP : 0,
                }}
              >
                <Image src={left} style={{ width: GAL_W, height: GAL_H, objectFit: "contain" }} />
              </View>
              {right && (
                <View style={{ width: GAL_W, height: GAL_H, backgroundColor: C.gray }}>
                  <Image src={right} style={{ width: GAL_W, height: GAL_H, objectFit: "contain" }} />
                </View>
              )}
            </View>
          ))}
        </Page>
      )}
    </Document>
  );
}

export function createFichaTecnicaElement(props: FichaTecnicaDocProps) {
  return React.createElement(FichaTecnicaDoc, props);
}
