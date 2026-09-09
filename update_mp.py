import re

file_path = r'C:\Users\Usuario\Desktop\Api-java-Venta-Entrrada\venta-entrada\src\main\java\com\example\venta_entrada\ventas\services\MercadoPagoService.java'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the inner part of createPreference
new_code = """
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("EEEE, d 'DE' MMMM", new java.util.Locale("es", "ES"));
            entradasByTipo.forEach((tipo, entradasList) -> {
                String fechaStr = tipo.getEvento().getFechaEvento().format(formatter).toUpperCase();
                String ubicacion = tipo.getEvento().getUbicacion() != null ? tipo.getEvento().getUbicacion() : "";
                String eventName = tipo.getEvento().getNombre() != null ? tipo.getEvento().getNombre() : "";
                
                String mpTitle = ubicacion + " • " + ubicacion + "\\n" +
                                 eventName + "\\n" +
                                 "FECHA: " + fechaStr + " - " + tipo.getNombre();

                java.util.Map<String, Object> item = new java.util.HashMap<>();
                item.put("id", tipo.getId().toString());
                item.put("title", mpTitle);
                item.put("quantity", entradasList.size());
                item.put("unit_price", tipo.getPrecio().doubleValue());
                item.put("currency_id", "ARS");
                items.add(item);
            });
"""

old_code = """
            entradasByTipo.forEach((tipo, entradasList) -> {
                java.util.Map<String, Object> item = new java.util.HashMap<>();
                item.put("id", tipo.getId().toString());
                item.put("title", "Entrada " + tipo.getEvento().getNombre() + " - " + tipo.getNombre());
                item.put("quantity", entradasList.size());
                item.put("unit_price", tipo.getPrecio().doubleValue());
                item.put("currency_id", "ARS");
                items.add(item);
            });
"""

if old_code.strip() in content:
    content = content.replace(old_code.strip(), new_code.strip())
else:
    # Try with regex just in case formatting is slightly different
    pattern = re.compile(r'entradasByTipo\.forEach\(\(tipo, entradasList\)\s*->\s*\{.*?\items\.add\(item\);\s*\}\);', re.DOTALL)
    content = pattern.sub(new_code.strip(), content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated successfully")
