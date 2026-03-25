import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface Hospital {
  name: string;
  address: string;
}

const NearbyHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const findHospitals = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");
    setHospitals([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const query = `[out:json];node["amenity"="hospital"](around:5000,${latitude},${longitude});out body;`;
          const res = await fetch(
            `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
          );
          const data = await res.json();

          const results: Hospital[] = data.elements
            .filter((el: any) => el.tags?.name)
            .slice(0, 10)
            .map((el: any) => ({
              name: el.tags.name,
              address:
                [el.tags["addr:street"], el.tags["addr:city"], el.tags["addr:postcode"]]
                  .filter(Boolean)
                  .join(", ") || "Address not available",
            }));

          setHospitals(results);
          setSearched(true);
          if (results.length === 0) {
            setError("No hospitals found within 5 km of your location.");
          }
        } catch {
          setError("Failed to fetch nearby hospitals. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied. Please allow location access and try again.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="text-center space-y-2 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-2xl">🏥</div>
        <h2 className="text-xl font-semibold text-foreground">Nearby Hospitals</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Find hospitals near your current location using GPS.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={findHospitals}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          {loading ? "Searching..." : "Find Hospitals Near Me"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          {error}
        </p>
      )}

      {hospitals.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          {hospitals.map((h, i) => (
            <div key={i} className="p-4 rounded-xl bg-secondary/50 border border-border flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">{h.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{h.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {searched && hospitals.length === 0 && !error && (
        <p className="text-sm text-muted-foreground text-center">No hospitals found nearby.</p>
      )}
    </div>
  );
};

export default NearbyHospitals;
