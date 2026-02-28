import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import PortionControl from '@/components/ui/PortionControl';

describe('PortionControl', () => {
    it('should render with correct portions value', () => {
        const onIncrease = vi.fn();
        const onDecrease = vi.fn();

        render(
            <PortionControl
                portions={4}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
            />
        );

        expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('should call onIncrease when plus button is clicked', () => {
        const onIncrease = vi.fn();
        const onDecrease = vi.fn();

        render(
            <PortionControl
                portions={4}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
            />
        );

        const increaseButton = screen.getByLabelText('Portionen erhöhen');
        fireEvent.click(increaseButton);

        expect(onIncrease).toHaveBeenCalledTimes(1);
    });

    it('should call onDecrease when minus button is clicked', () => {
        const onIncrease = vi.fn();
        const onDecrease = vi.fn();

        render(
            <PortionControl
                portions={4}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
            />
        );

        const decreaseButton = screen.getByLabelText('Portionen verringern');
        fireEvent.click(decreaseButton);

        expect(onDecrease).toHaveBeenCalledTimes(1);
    });

    it('should disable decrease button when at minimum', () => {
        const onIncrease = vi.fn();
        const onDecrease = vi.fn();

        render(
            <PortionControl
                portions={1}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                minPortions={1}
            />
        );

        const decreaseButton = screen.getByLabelText('Portionen verringern');
        expect(decreaseButton).toBeDisabled();
    });

    it('should disable increase button when at maximum', () => {
        const onIncrease = vi.fn();
        const onDecrease = vi.fn();

        render(
            <PortionControl
                portions={100}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                maxPortions={100}
            />
        );

        const increaseButton = screen.getByLabelText('Portionen erhöhen');
        expect(increaseButton).toBeDisabled();
    });

    it('should use custom min and max portions', () => {
        const onIncrease = vi.fn();
        const onDecrease = vi.fn();

        render(
            <PortionControl
                portions={5}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                minPortions={5}
                maxPortions={10}
            />
        );

        const decreaseButton = screen.getByLabelText('Portionen verringern');
        const increaseButton = screen.getByLabelText('Portionen erhöhen');

        expect(decreaseButton).toBeDisabled();
        expect(increaseButton).not.toBeDisabled();
    });
});
