import { expect, test } from "@playwright/test";

// Se siembra la conversación en sessionStorage (misma clave que usa el panel)
// para no depender de la API del modelo: solo se prueba la navegación.
test("tocar una tarjeta del asistente abre la ficha y cierra el panel", async ({ page, isMobile }) => {
  // Un slug real del inventario, tomado del listado público.
  await page.goto("/propiedades");
  const href = await page.locator('a[href^="/propiedades/"]').first().getAttribute("href");
  expect(href).toMatch(/^\/propiedades\/[^/]+$/);

  await page.evaluate((url) => {
    sessionStorage.setItem(
      "blav-asistente-v1",
      JSON.stringify({
        conversacionId: "e2e",
        mensajes: [
          { rol: "usuario", texto: "Busco casa" },
          {
            rol: "asistente",
            texto: "Te comparto una opción:",
            ids: ["e2e"],
            tarjetas: [
              {
                id: "e2e",
                titulo: "Propiedad de prueba",
                url,
                imagen: "",
                etiqueta: "Casa · Venta",
                precio: "$1,000,000",
                notaPrecio: "",
                zona: "Querétaro",
                specs: [],
              },
            ],
          },
        ],
      })
    );
  }, href!);

  await page.goto("/");
  await page.getByRole("button", { name: "Abrir asistente de IA de BLAV" }).click();
  const tarjeta = page.getByRole("link", { name: /Propiedad de prueba/ });
  await expect(tarjeta).toBeVisible();

  if (isMobile) await tarjeta.tap();
  else await tarjeta.click();

  await expect.poll(() => new URL(page.url()).pathname).toBe(href);
  await expect(tarjeta).toBeHidden();
  await expect(page.getByRole("button", { name: "Abrir asistente de IA de BLAV" })).toHaveAttribute(
    "aria-expanded",
    "false"
  );

  // "Atrás" regresa a la página de origen, no a una entrada fantasma del panel.
  await page.goBack();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/");
});
