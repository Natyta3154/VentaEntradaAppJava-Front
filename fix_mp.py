import base64

file_path = r'C:\Users\Usuario\Desktop\Api-java-Venta-Entrrada\venta-entrada\src\main\java\com\example\venta_entrada\ventas\services\MercadoPagoService.java'

with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

start_str = "entradasByTipo.forEach((tipo, entradasList) -> {"
end_str = "items.add(item);\n            });"

start_idx = content.find(start_str)
end_idx = content.find(end_str) + len(end_str)

new_block = """entradasByTipo.forEach((tipo, entradasList) -> {
                String fechaStr = tipo.getEvento().getFechaEvento().format(formatter).toUpperCase();
                String ubicacion = tipo.getEvento().getUbicacion() != null ? tipo.getEvento().getUbicacion() : "";
                String eventName = tipo.getEvento().getNombre() != null ? tipo.getEvento().getNombre() : "";
                
                String mpTitle = ubicacion + " \\u2022 " + ubicacion + "\\n" +
                                 eventName + "\\n" +
                                 "FECHA: " + fechaStr + " - " + tipo.getNombre();

                java.util.Map<String, Object> item = new java.util.HashMap<>();
                item.put("id", tipo.getId().toString());
                item.put("title", mpTitle);
                item.put("quantity", entradasList.size());
                item.put("unit_price", tipo.getPrecio().doubleValue());
                item.put("currency_id", "ARS");
                items.add(item);
            });"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_block + content[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed title assignment safely")
else:
    print("Could not find the block to replace")
