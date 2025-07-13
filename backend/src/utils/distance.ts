// Функция для расчета расстояния между двумя точками (формула Haversine)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Радиус Земли в километрах
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Расстояние в километрах
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Функция для поиска ближайших водителей
export function findNearbyDrivers(
  clientLat: number,
  clientLng: number,
  drivers: Array<{ id: string; latitude?: number; longitude?: number }>,
  maxDistance: number = 10 // максимальное расстояние в км
): Array<{ id: string; distance: number }> {
  return drivers
    .filter(driver => driver.latitude && driver.longitude)
    .map(driver => ({
      id: driver.id,
      distance: calculateDistance(
        clientLat,
        clientLng,
        driver.latitude!,
        driver.longitude!
      )
    }))
    .filter(driver => driver.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

// Функция для расчета примерной стоимости поездки
export function calculateFare(
  distance: number,
  rideType: string
): number {
  const baseRates = {
    'Эконом': { base: 150, perKm: 25 },
    'Комфорт': { base: 200, perKm: 35 },
    'Бизнес': { base: 300, perKm: 50 }
  };

  const rate = baseRates[rideType as keyof typeof baseRates] || baseRates['Эконом'];
  return Math.max(rate.base, rate.base + (distance * rate.perKm));
}

// Функция для расчета времени поездки (примерно)
export function estimateTravelTime(distance: number): number {
  // Примерная скорость 30 км/ч в городе
  const averageSpeed = 30;
  return Math.round((distance / averageSpeed) * 60); // время в минутах
}