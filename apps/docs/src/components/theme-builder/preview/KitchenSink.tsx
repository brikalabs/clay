/**
 * Curated gallery exercising the most token surface area in one
 * viewport: typography, every button variant, a card with shadow, a
 * form, four alert states, a dialog, a toast trigger, tabs, an area
 * chart, and badges + a kbd. Lives inside a scoped wrapper so the
 * user-authored theme paints here independently of the global theme.
 *
 * Individual panels live in `KitchenSink.parts.tsx` so this file
 * stays a thin composition.
 */

import { useMemo } from 'react';

import { makeChartData } from './_chart-data';
import {
  Alerts,
  Badges,
  Buttons,
  Cards,
  DialogAndToast,
  FormPanel,
  TabsAndChart,
  Typography,
} from './KitchenSink.parts';

export function KitchenSink() {
  const chartData = useMemo(() => makeChartData(1), []);

  return (
    <div className="flex flex-col gap-6">
      <Typography />
      <Buttons />
      <Cards />
      <FormPanel />
      <Alerts />
      <DialogAndToast />
      <TabsAndChart chartData={chartData} />
      <Badges />
    </div>
  );
}
