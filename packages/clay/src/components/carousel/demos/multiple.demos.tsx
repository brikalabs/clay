import { Card, CardContent } from '@brika/clay/components/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@brika/clay/components/carousel';
const SLIDES_6 = [1, 2, 3, 4, 5, 6] as const;

export default function CarouselMultipleDemo() {
  return (
    <Carousel opts={{ align: 'start' }} className="w-full max-w-sm">
      <CarouselContent className="-ml-2">
        {SLIDES_6.map((n) => (
          <CarouselItem key={n} className="basis-1/3 pl-2">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <span className="font-semibold text-2xl">{n}</span>
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
