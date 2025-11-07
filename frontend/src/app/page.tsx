import { Search } from "src/components/search"
import { FeaturedDestinations } from "src/components/featured-destinations"
import { SpecialOffers } from "src/components/special-offers"
import { Testimonials } from "src/components/testimonials"
import { Newsletter } from "src/components/newsletter"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative h-[500px] bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="absolute inset-0 bg-black/10" />
          <div className="container relative z-10 flex flex-col items-center justify-center h-full px-4 py-16 mx-auto text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Search cheap flight tickets</h1>
            <p className="max-w-md mt-4 text-lg">
              Search and compare flights from hundreds of airlines and travel agencies
            </p>
            <div className="w-full max-w-5xl mt-8">
              <Search />
            </div>
          </div>
        </section>

        <FeaturedDestinations />
        <SpecialOffers />
        <Testimonials />
        <Newsletter />
      </main>
    </div>
  )
}
