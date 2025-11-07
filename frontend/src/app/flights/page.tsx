import { ArrowRight, Filter, Luggage, Clock, Calendar, DollarSign, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "src/components/search"
import Image from "next/image"
import Link from "next/link"

const flights = [
  {
    id: "fl-1",
    airline: "SkyWay Airlines",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureTime: "08:30",
    departureDate: "Apr 28, 2025",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "11:45",
    arrivalDate: "Apr 28, 2025",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "6h 15m",
    stops: 0,
    price: 299,
    baggage: "1 carry-on, 1 checked",
    agency: "DirectFlights",
  },
  {
    id: "fl-2",
    airline: "Global Airways",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureTime: "10:15",
    departureDate: "Apr 28, 2025",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "14:30",
    arrivalDate: "Apr 28, 2025",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "7h 15m",
    stops: 1,
    stopAirport: "DFW",
    stopDuration: "1h 20m",
    price: 249,
    baggage: "1 carry-on",
    agency: "FlightDeals",
  },
  {
    id: "fl-3",
    airline: "Pacific Air",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureTime: "14:20",
    departureDate: "Apr 28, 2025",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "17:35",
    arrivalDate: "Apr 28, 2025",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "6h 15m",
    stops: 0,
    price: 329,
    baggage: "1 carry-on, 2 checked",
    agency: "SkyBooker",
  },
  {
    id: "fl-4",
    airline: "American Eagle",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureTime: "16:45",
    departureDate: "Apr 28, 2025",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "22:15",
    arrivalDate: "Apr 28, 2025",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "8h 30m",
    stops: 1,
    stopAirport: "ORD",
    stopDuration: "2h 15m",
    price: 219,
    baggage: "1 carry-on",
    agency: "TravelSmart",
  },
  {
    id: "fl-5",
    airline: "Delta Connect",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureTime: "07:15",
    departureDate: "Apr 28, 2025",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "13:45",
    arrivalDate: "Apr 28, 2025",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "9h 30m",
    stops: 2,
    stopAirports: ["ATL", "DEN"],
    stopDurations: ["1h 30m", "1h 45m"],
    price: 199,
    baggage: "1 carry-on",
    agency: "FlightDeals",
  },
]

const airlines = [
  "SkyWay Airlines",
  "Global Airways",
  "Pacific Air",
  "American Eagle",
  "Delta Connect",
  "United Airlines",
  "Southwest",
  "JetBlue",
]

const agencies = ["DirectFlights", "FlightDeals", "SkyBooker", "TravelSmart", "FlyEasy", "AirBookings"]

const connectingAirports = [
  { code: "ATL", name: "Atlanta" },
  { code: "ORD", name: "Chicago" },
  { code: "DFW", name: "Dallas" },
  { code: "DEN", name: "Denver" },
  { code: "LAX", name: "Los Angeles" },
  { code: "MIA", name: "Miami" },
]

export default function FlightPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Search bar at the top */}
      <div className="mb-8">
        <Search compact={true} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Flight Search Results</h1>
        <p className="text-sm text-muted-foreground">
          New York (JFK) to Los Angeles (LAX) · Apr 28, 2025 · 1 Passenger
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr]">
        {/* Filter Sidebar */}
        <div className="order-2 md:order-1">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="flex items-center mb-6 text-lg font-semibold">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h2>

              <Accordion type="multiple" defaultValue={["stops", "price", "duration", "times"]}>
                {/* Flight Stops */}
                <AccordionItem value="stops">
                  <AccordionTrigger className="py-3 text-base">Flight Stops</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="nonstop" defaultChecked />
                        <Label htmlFor="nonstop" className="text-sm">
                          Nonstop
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="one-stop" defaultChecked />
                        <Label htmlFor="one-stop" className="text-sm">
                          1 Stop
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="two-stops" defaultChecked />
                        <Label htmlFor="two-stops" className="text-sm">
                          2+ Stops
                        </Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem value="price">
                  <AccordionTrigger className="py-3 text-base">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Price Range
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-1">
                      <Slider defaultValue={[150, 400]} min={100} max={1000} step={10} />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">$150</span>
                        <span className="text-sm">$400</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Trip Duration */}
                <AccordionItem value="duration">
                  <AccordionTrigger className="py-3 text-base">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Trip Duration
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-1">
                      <Slider defaultValue={[360, 600]} min={180} max={720} step={10} />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">6h</span>
                        <span className="text-sm">10h</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Flight Times */}
                <AccordionItem value="times">
                  <AccordionTrigger className="py-3 text-base">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Flight Times
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1">
                      <div>
                        <p className="mb-2 text-sm font-medium">Departure</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="dep-morning" defaultChecked />
                            <Label htmlFor="dep-morning" className="text-sm">
                              Morning (5am - 12pm)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="dep-afternoon" defaultChecked />
                            <Label htmlFor="dep-afternoon" className="text-sm">
                              Afternoon (12pm - 5pm)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="dep-evening" defaultChecked />
                            <Label htmlFor="dep-evening" className="text-sm">
                              Evening (5pm - 11pm)
                            </Label>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <div>
                        <p className="mb-2 text-sm font-medium">Arrival</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="arr-morning" defaultChecked />
                            <Label htmlFor="arr-morning" className="text-sm">
                              Morning (5am - 12pm)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="arr-afternoon" defaultChecked />
                            <Label htmlFor="arr-afternoon" className="text-sm">
                              Afternoon (12pm - 5pm)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="arr-evening" defaultChecked />
                            <Label htmlFor="arr-evening" className="text-sm">
                              Evening (5pm - 11pm)
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Baggage */}
                <AccordionItem value="baggage">
                  <AccordionTrigger className="py-3 text-base">
                    <div className="flex items-center">
                      <Luggage className="w-4 h-4 mr-2" />
                      Baggage
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="carry-on" defaultChecked />
                        <Label htmlFor="carry-on" className="text-sm">
                          Carry-on included
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="checked-bag" />
                        <Label htmlFor="checked-bag" className="text-sm">
                          1+ Checked bag included
                        </Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Agencies */}
                <AccordionItem value="agencies">
                  <AccordionTrigger className="py-3 text-base">Agencies</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1 max-h-40 overflow-y-auto pr-2">
                      {agencies.map((agency) => (
                        <div key={agency} className="flex items-center space-x-2">
                          <Checkbox id={`agency-${agency.toLowerCase()}`} defaultChecked />
                          <Label htmlFor={`agency-${agency.toLowerCase()}`} className="text-sm">
                            {agency}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Connecting Airports */}
                <AccordionItem value="connecting">
                  <AccordionTrigger className="py-3 text-base">Connecting Airports</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1 max-h-40 overflow-y-auto pr-2">
                      {connectingAirports.map((airport) => (
                        <div key={airport.code} className="flex items-center space-x-2">
                          <Checkbox id={`airport-${airport.code}`} defaultChecked />
                          <Label htmlFor={`airport-${airport.code}`} className="text-sm">
                            {airport.code} - {airport.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Airlines */}
                <AccordionItem value="airlines">
                  <AccordionTrigger className="py-3 text-base">
                    <div className="flex items-center">
                      <Plane className="w-4 h-4 mr-2" />
                      Airlines
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1 max-h-40 overflow-y-auto pr-2">
                      {airlines.map((airline) => (
                        <div key={airline} className="flex items-center space-x-2">
                          <Checkbox id={`airline-${airline.toLowerCase().replace(/\s+/g, "-")}`} defaultChecked />
                          <Label htmlFor={`airline-${airline.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm">
                            {airline}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="w-1/2">
                  Reset
                </Button>
                <Button className="w-1/2 bg-rose-500 hover:bg-rose-600">Apply</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flight Results */}
        <div className="order-1 md:order-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">{flights.length} results found</p>
            <Select defaultValue="price-asc">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="duration-asc">Duration: Shortest</SelectItem>
                <SelectItem value="departure-asc">Departure: Earliest</SelectItem>
                <SelectItem value="arrival-asc">Arrival: Earliest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {flights.map((flight) => (
              <Card key={flight.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 overflow-hidden rounded-full">
                            <Image
                              src={flight.airlineLogo || "/placeholder.svg"}
                              alt={flight.airline}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{flight.airline}</h3>
                            <p className="text-xs text-muted-foreground">Flight #{flight.id}</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Operated by:</span> {flight.agency}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
                        <div>
                          <p className="text-2xl font-semibold">{flight.departureTime}</p>
                          <p className="font-medium">{flight.departureAirport}</p>
                          <p className="text-sm text-muted-foreground">{flight.departureCity}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{flight.departureDate}</p>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                          <p className="text-xs text-muted-foreground">{flight.duration}</p>
                          <div className="relative w-full my-2">
                            <Separator className="absolute top-1/2 w-full" />
                            <div className="relative flex items-center justify-center">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                              {flight.stops > 0 && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                                  <Badge variant="outline" className="text-xs">
                                    {flight.stops} {flight.stops === 1 ? "stop" : "stops"}
                                  </Badge>
                                </div>
                              )}
                              <ArrowRight className="absolute w-4 h-4 right-0" />
                            </div>
                          </div>
                          {flight.stops === 0 && <p className="text-xs text-muted-foreground">Nonstop</p>}
                          {flight.stops === 1 && (
                            <p className="text-xs text-muted-foreground">
                              via {flight.stopAirport} ({flight.stopDuration})
                            </p>
                          )}
                          {flight.stops > 1 && flight.stopAirports && (
                            <p className="text-xs text-muted-foreground">via {flight.stopAirports.join(", ")}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-semibold">{flight.arrivalTime}</p>
                          <p className="font-medium">{flight.arrivalAirport}</p>
                          <p className="text-sm text-muted-foreground">{flight.arrivalCity}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{flight.arrivalDate}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
                        <Badge variant="secondary" className="font-normal">
                          <Luggage className="w-3 h-3 mr-1" />
                          {flight.baggage}
                        </Badge>
                        {flight.stops === 0 && (
                          <Badge
                            variant="outline"
                            className="text-emerald-600 border-emerald-200 bg-emerald-50 font-normal"
                          >
                            Fastest
                          </Badge>
                        )}
                        {flight.price < 250 && (
                          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 font-normal">
                            Best value
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 sm:p-6">
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="text-2xl font-bold text-rose-500">${flight.price}</p>
                      <p className="mb-4 text-xs text-muted-foreground">per person</p>
                      <Link href={`/flights/booking/${flight.id}`}>
                        <Button className="bg-rose-500 hover:bg-rose-600">Select</Button>
                      </Link>
                      <Button variant="link" size="sm" className="mt-2">
                        Flight details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline" className="mx-1">
              Previous
            </Button>
            <Button variant="outline" className="mx-1 bg-rose-500 text-white hover:bg-rose-600">
              1
            </Button>
            <Button variant="outline" className="mx-1">
              2
            </Button>
            <Button variant="outline" className="mx-1">
              3
            </Button>
            <Button variant="outline" className="mx-1">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
