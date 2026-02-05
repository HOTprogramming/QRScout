import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import { useCallback, useEffect, useState } from 'react';
import { Slider } from '../ui/slider';
import { RangeInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

export default function RangeInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<RangeInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  const min = data.min ?? 0;
  const max = data.max ?? 100;
  const step = data.step ?? 1;

  const snapToStep = useCallback(
    (raw: number) => {
      const steps = Math.round((raw - min) / step);
      return Math.min(max, Math.max(min, min + steps * step));
    },
    [min, max, step],
  );

  const [value, setValue] = useState(() => snapToStep(data.defaultValue));

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      if (force) {
        setValue(snapToStep(data.defaultValue));
        return;
      }
      switch (data.formResetBehavior) {
        case 'reset':
          setValue(snapToStep(data.defaultValue));
          return;
        case 'increment':
          setValue(prev =>
            snapToStep(typeof prev === 'number' ? prev + step : min),
          );
          return;
        case 'preserve':
          return;
        default:
          return;
      }
    },
    [data.defaultValue, data.formResetBehavior, snapToStep, step, min],
  );

  useEvent('resetFields', resetState);

  const handleChange = useCallback(
    (rawValues: number[]) => {
      setValue(snapToStep(rawValues[0]));
    },
    [snapToStep],
  );

  useEffect(() => {
    updateValue(props.code, value);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <span className="capitalize text-secondary-foreground text-2xl">
        {value}
      </span>
      <Slider
        className="w-full py-2 px-1"
        min={min}
        max={max}
        step={step}
        value={[value ?? 0]}
        id={data.title}
        onValueChange={handleChange}
      />
    </div>
  );
}
