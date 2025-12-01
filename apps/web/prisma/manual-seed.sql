-- Insert shipping methods
INSERT INTO shipping_methods (id, name, type, description, "isActive", "freeShippingThreshold", "createdAt", "updatedAt")
VALUES 
  ('pharmacy_001', 'Retrait en Pharmacie', 'PHARMACY', 'Retrait gratuit en 2h', true, 0, NOW(), NOW()),
  ('home_001', 'Livraison à Domicile', 'HOME', 'Livraison Colissimo sous 48h', true, 50, NOW(), NOW()),
  ('relay_001', 'Point Relais', 'RELAY', 'Livraison en point relais sous 3-4j', true, 40, NOW(), NOW())
ON CONFLICT (type) DO NOTHING;

-- Insert default rates for Home delivery
INSERT INTO shipping_rates (id, "shippingMethodId", "minWeight", "maxWeight", price, "createdAt", "updatedAt")
VALUES 
  ('rate_home_001', 'home_001', 0, 100, 4.90, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert default rates for Relay delivery
INSERT INTO shipping_rates (id, "shippingMethodId", "minWeight", "maxWeight", price, "createdAt", "updatedAt")
VALUES 
  ('rate_relay_001', 'relay_001', 0, 100, 3.90, NOW(), NOW())
ON CONFLICT DO NOTHING;
