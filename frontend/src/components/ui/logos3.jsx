"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { memo } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./carousel";

const Logos3 = memo(
  ({
    heading = "Trusted by leading event organizations worldwide",
    logos = [
      {
        id: "logo-1",
        description: "Eventbrite",
        image: "/brand-eventbrite.svg",
        className: "h-48 w-auto max-w-[300px]",
      },
      {
        id: "logo-2",
        description: "TED",
        image: "/brand-ted.svg",
        className: "h-48 w-auto max-w-[300px]",
      },
      {
        id: "logo-3",
        description: "Meetup",
        image: "/brand-meetup.svg",
        className: "h-48 w-auto max-w-[300px]",
      },
      {
        id: "logo-4",
        description: "Ticketmaster",
        image: "/brand-ticketmaster.svg",
        className: "h-48 w-auto max-w-[300px]",
      },
      {
        id: "logo-5",
        description: "Web Summit",
        image: "/brand-websummit.svg",
        className: "h-48 w-auto max-w-[300px]",
      },
      {
        id: "logo-6",
        description: "Spotify",
        image: "/brand-spotify.svg",
        className: "h-48 w-auto max-w-[300px]",
      },
      {
        id: "logo-7",
        description: "YouTube",
        image: "/brand-youtube.svg",
        className: "h-48 w-auto max-w-[300px]",
      },
      {
        id: "logo-8",
        description: "Airbnb",
        image: "/brand-airbnb.svg",
        className: "h-48 w-auto max-w-[300px]",
      },
    ],
  }) => {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-violet-500/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              {heading}
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              From music festivals to tech conferences, top event organizers
              choose EventBooker for their ticketing and event management needs
            </p>
          </div>

          {/* Logos Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <Carousel
                opts={{
                  loop: true,
                  align: "start",
                  skipSnaps: false,
                }}
                plugins={[
                  AutoScroll({
                    playOnInit: true,
                    speed: 1.2,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent className="flex">
                  {[...logos, ...logos].map((logo, index) => (
                    <CarouselItem
                      key={`${logo.id}-${index}`}
                      className="flex-none pr-8"
                    >
                      <div className="flex items-center justify-center h-56 w-[300px] group cursor-pointer">
                        <img
                          src={logo.image}
                          alt={`${logo.description} logo`}
                          className={`${logo.className} opacity-60 group-hover:opacity-100 transition-all duration-500 filter brightness-90 group-hover:brightness-110 group-hover:scale-110 max-w-full max-h-full object-contain`}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/placeholder-ou0xv.png";
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
          </div>
        </div>
      </section>
    );
  }
);

Logos3.displayName = "Logos3";

export { Logos3 };
