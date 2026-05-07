import { Card, CardContent } from '@brika/clay/components/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@brika/clay/components/carousel';
import { defineDemos } from '../_registry';

const SLIDES_5 = [1, 2, 3, 4, 5] as const;
const SLIDES_6 = [1, 2, 3, 4, 5, 6] as const;

export function CarouselDefaultDemo() {
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

export function CarouselMultipleDemo() {
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

export const demoMeta = defineDemos([
  [CarouselDefaultDemo, 'Default'],
  [CarouselMultipleDemo, 'Multiple'],
]);
export const accessibility: readonly string[] = [
  `Root carries \`role="region"\` with a label; each slide has \`role="group" aria-roledescription="slide"\`.`,
  `Previous/Next buttons include \`sr-only\` screen-reader labels.`,
  `Left/Right arrow keys navigate slides while focus is inside the carousel.`,
  `Autoplay should pause on hover and focus to respect user attention and \`prefers-reduced-motion\`.`,
];
