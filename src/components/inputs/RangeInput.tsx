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

  const [value, setValue] = useState(data.defaultValue);

  const resetState = useCallback((force = false) => {
    if (!force && (data.preserveDataOnReset || props.preserveSection)) {
      return;
    }
    setValue(data.defaultValue);
  }, [data.defaultValue]);

  useEvent('resetFields', resetState);
  useEvent('forceResetFields', () => resetState(true) );

  const handleChange = useCallback((value: number[]) => {
    setValue(value[0]);
  }, []);

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
        min={data.min}
        max={data.max}
        value={[value || 0]}
        defaultValue={[data.defaultValue || 0]}
        id={data.title}
        onValueChange={handleChange}
      />
    </div>
  );
}
