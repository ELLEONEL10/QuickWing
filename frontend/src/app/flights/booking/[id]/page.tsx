import { ArrowRight, CreditCard, Info, Plane, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"

export default function BookingPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the flight details based on the ID
  const flight = {
    id: params.id,
    airline: "SkyWay Airlines",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureDate: "April 28, 2025",
    departureTime: "08:30",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "11:45",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "6h 15m",
    stops: 0,
    price: 299,
    tax: 45,
    total: 344,
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Complete Your Booking</h1>
        <p className="text-muted-foreground">
          Flight {flight.id} · {flight.departureCity} to {flight.arrivalCity} · {flight.departureDate}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-4 mb-4">
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
                        <ArrowRight className="absolute w-4 h-4 right-0" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Nonstop</p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-semibold">{flight.arrivalTime}</p>
                    <p className="font-medium">{flight.arrivalAirport}</p>
                    <p className="text-sm text-muted-foreground">{flight.arrivalCity}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{flight.departureDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Passenger Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Enter last name" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="Enter phone number" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select>
                        <SelectTrigger id="dob-day">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger id="dob-month">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                            (month, i) => (
                              <SelectItem key={i} value={(i + 1).toString()}>
                                {month}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger id="dob-year">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 100 }, (_, i) => (
                            <SelectItem key={i} value={(2025 - i).toString()}>
                              {2025 - i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select>
                      <SelectTrigger id="nationality">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passport">Passport Number</Label>
                  <Input id="passport" placeholder="Enter passport number" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="0000 0000 0000 0000" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select>
                            <SelectTrigger id="expiry-month">
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                                  {(i + 1).toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger id="expiry-year">
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem key={i} value={(25 + i).toString()}>
                                  {(25 + i).toString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">Name on Card</Label>
                      <Input id="name-on-card" placeholder="Enter name as it appears on card" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="paypal" className="mt-4">
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">PayPal integration coming soon!</p>
                  </div>
                </TabsContent>
                <TabsContent value="apple" className="mt-4">
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">Apple Pay integration coming soon!</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Flight {flight.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Outbound Flight</div>
                    <div className="text-sm text-muted-foreground">{flight.departureDate}</div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-6 h-6 overflow-hidden rounded-full">
                      <Image
                        src={flight.airlineLogo || "/placeholder.svg"}
                        alt={flight.airline}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-sm">{flight.airline}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      {flight.departureTime} {flight.departureAirport}
                    </div>
                    <div>→</div>
                    <div>
                      {flight.arrivalTime} {flight.arrivalAirport}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 font-medium">Fare Options</div>
                  <RadioGroup defaultValue="economy">
                    <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
                      <div className="flex items-start gap-2">
                        <RadioGroupItem value="economy" id="economy" />
                        <div>
                          <Label htmlFor="economy" className="font-medium">
                            Economy
                          </Label>
                          <p className="text-xs text-muted-foreground">Standard seat, 1 carry-on bag</p>
                        </div>
                      </div>
                      <div className="font-medium">${flight.price}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
                      <div className="flex items-start gap-2">
                        <RadioGroupItem value="premium" id="premium" />
                        <div>
                          <Label htmlFor="premium" className="font-medium">
                            Premium Economy
                          </Label>
                          <p className="text-xs text-muted-foreground">Extra legroom, priority boarding</p>
                        </div>
                      </div>
                      <div className="font-medium">${flight.price + 80}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-start gap-2">
                        <RadioGroupItem value="business" id="business" />
                        <div>
                          <Label htmlFor="business" className="font-medium">
                            Business
                          </Label>
                          <p className="text-xs text-muted-foreground">Premium seat, lounge access</p>
                        </div>
                      </div>
                      <div className="font-medium">${flight.price + 250}</div>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>Base fare</div>
                    <div>${flight.price}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Taxes & fees</div>
                    <div>${flight.tax}</div>
                  </div>
                  <div className="flex items-center justify-between font-bold">
                    <div>Total</div>
                    <div>${flight.total}</div>
                  </div>
                </div>

                <div className="p-3 text-sm border rounded-lg bg-muted/30">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <p>
                      By proceeding with this booking, you agree to our{" "}
                      <Link href="/terms" className="text-rose-500 hover:underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-rose-500 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <Button className="w-full bg-rose-500 hover:bg-rose-600">Complete Booking</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
