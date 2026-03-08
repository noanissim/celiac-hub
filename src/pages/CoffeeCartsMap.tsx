import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { coffeeCarts, CoffeeCart } from "@/data/coffeeCarts";
import { Coffee, MapPin, Clock, Wheat, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Fix default marker icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const coffeeIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Israel center coordinates
const ISRAEL_CENTER: [number, number] = [31.95, 34.85];
const ZOOM_LEVEL = 8;

function CartDetailPanel({ cart, onClose }: { cart: CoffeeCart; onClose: () => void }) {
  return (
    <div className="absolute top-4 right-4 z-[1000] w-80 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border bg-card shadow-xl animate-in slide-in-from-right-5 duration-300">
      <div className="relative p-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4 pr-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground leading-tight">{cart.name}</h3>
            <p className="text-sm text-muted-foreground">{cart.nameHe}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2.5 mb-3">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">{cart.location}</p>
            <p className="text-xs text-muted-foreground">{cart.address}</p>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-2.5 mb-3">
          <Clock className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
          <p className="text-sm text-foreground">{cart.hours}</p>
        </div>

        {/* GF Options */}
        <div className="flex items-start gap-2.5 mb-4">
          <Wheat className="h-4 w-4 mt-0.5 shrink-0 text-accent-foreground" />
          <div>
            <Badge variant="secondary" className="mb-1.5 text-xs">Gluten-Free Options</Badge>
            <p className="text-sm text-foreground">{cart.gfOptions}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 border-t pt-3">{cart.description}</p>

        {/* Actions */}
        <div className="flex gap-2">
          {cart.menuLink && (
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <a href={cart.menuLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                CoffeeTrail
              </a>
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${cart.lat},${cart.lng}`,
                "_blank"
              )
            }
          >
            <MapPin className="h-3.5 w-3.5" />
            Directions
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CoffeeCartsMap() {
  const [selectedCart, setSelectedCart] = useState<CoffeeCart | null>(null);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {/* Title overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 rounded-xl border bg-card/95 backdrop-blur px-4 py-2.5 shadow-lg">
        <Coffee className="h-5 w-5 text-primary" />
        <div>
          <h1 className="text-sm font-bold text-foreground leading-tight">Coffee Carts Map</h1>
          <p className="text-xs text-muted-foreground">{coffeeCarts.length} GF-friendly carts across Israel</p>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={ISRAEL_CENTER}
        zoom={ZOOM_LEVEL}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coffeeCarts.map((cart) => (
          <Marker
            key={cart.id}
            position={[cart.lat, cart.lng]}
            icon={coffeeIcon}
            eventHandlers={{
              click: () => setSelectedCart(cart),
            }}
          >
            <Popup>
              <div className="text-center">
                <strong>{cart.name}</strong>
                <br />
                <span className="text-xs">{cart.location}</span>
                <br />
                <button
                  className="mt-1 text-xs text-blue-600 underline"
                  onClick={() => setSelectedCart(cart)}
                >
                  View details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Detail panel */}
      {selectedCart && (
        <CartDetailPanel cart={selectedCart} onClose={() => setSelectedCart(null)} />
      )}
    </div>
  );
}
