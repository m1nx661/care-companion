import { useState } from "react";
import { MapPin, Loader2, Navigation } from "lucide-react";

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
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      <div className="text-center space-y-3 py-4">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
          <Navigation className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Nearby Hospitals</h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Find hospitals near your current location using GPS.
        </p>
      </div>

      <button
        onClick={findHospitals}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2.5 hover:opacity-90 transition-all disabled:opacity-60 shadow-md"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
        {loading ? "Searching..." : "Find Hospitals Near Me"}
      </button>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {hospitals.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          {hospitals.map((h, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground">{h.name}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{h.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {searched && hospitals.length === 0 && !error && (
        <p className="text-sm text-muted-foreground text-center py-6">No hospitals found nearby.</p>
      )}
    </div>
  );
};

export default NearbyHospitals;
