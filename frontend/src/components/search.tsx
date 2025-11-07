"use client"

import { useState } from "react"
import { SearchIcon, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "lib/utils"
import { format } from "date-fns"
import Link from "next/link"

export function Search({ compact = false }) {
  const [tripType, setTripType] = useState("round-trip")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [passengers, setPassengers] = useState(1)

  return (
    <Card className="w-full">
      <CardContent className={cn("p-4 sm:p-6", compact && "p-3 sm:p-4")}>
        <Tabs defaultValue="flights" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
          </TabsList>

          <TabsContent value="flights" className="mt-0">
            <div className="space-y-4">
              <RadioGroup defaultValue="round-trip" className="flex flex-wrap gap-4" onValueChange={setTripType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="round-trip" id="round-trip" />
                  <Label htmlFor="round-trip">Round Trip</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-way" id="one-way" />
                  <Label htmlFor="one-way">One Way</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multi-city" id="multi-city" />
                  <Label htmlFor="multi-city">Multi-City</Label>
                </div>
              </RadioGroup>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 min-w-0">
                  <div className="relative h-full">
                    <Input id="from" placeholder="From" className="h-full" />
                    <span className="absolute text-xs text-muted-foreground top-1 left-3">From</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 relative">
                  <div className="relative h-full">
                    <Input id="to" placeholder="To" className="h-full" />
                    <span className="absolute text-xs text-muted-foreground top-1 left-3">To</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      aria-label="Swap destinations"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-full",
                          !departureDate && "text-muted-foreground",
                        )}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-muted-foreground">Departure</span>
                          <span>{departureDate ? format(departureDate, "MMM d, yyyy") : "Select date"}</span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {tripType === "round-trip" && (
                  <div className="flex-1 min-w-0">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-full",
                            !returnDate && "text-muted-foreground",
                          )}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-xs text-muted-foreground">Return</span>
                            <span>{returnDate ? format(returnDate, "MMM d, yyyy") : "Select date"}</span>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal h-full">
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-muted-foreground">Travelers</span>
                          <span>
                            {passengers} {passengers === 1 ? "passenger" : "passengers"}
                          </span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Adults</div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setPassengers(Math.max(1, passengers - 1))}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{passengers}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setPassengers(passengers + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="sm:w-auto">
                  <Link href="/flights">
                    <Button className="w-full h-full bg-rose-500 hover:bg-rose-600">
                      <SearchIcon className="w-4 h-4 mr-2" />
                      Search Flights
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hotels" className="mt-0">
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Hotel search coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
