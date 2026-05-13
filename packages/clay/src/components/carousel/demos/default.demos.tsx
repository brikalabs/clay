import { Card, CardContent } from '@brika/clay/components/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@brika/clay/components/carousel';
const SLIDES_5 = [1, 2, 3, 4, 5] as const;

export default function CarouselDefaultDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {SLIDES_5.map((n) => (
          <CarouselItem key={n}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="font-semibold text-4xl">{n}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
