import useOutsideClick from '@hooks/common/useOutSideClick';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

const mockClick = vi.fn();

describe('useOutSideClick > ', () => {
	const TestComponent = ({
		onClickOutside,
	}: {
		onClickOutside: () => void;
	}) => {
		const ref = useOutsideClick({ onClickOutside });

		return (
			<div>
				<div data-testid='outside1'>메인 콘텐츠 바깥에 있는 친구 1</div>
				<main data-testid='main' ref={ref}>
					메인 콘텐츠
				</main>
				<div data-testid='outside2'>메인 콘텐츠 바깥에 있는 친구 2</div>
			</div>
		);
	};

	test('useOutSideClick에 대해 테스트 해보기', async () => {
		const { getByTestId, rerender } = render(
			<TestComponent onClickOutside={mockClick} />
		);

		const outside1 = getByTestId('outside1');
		const outside2 = getByTestId('outside2');
		const main = getByTestId('main');

		expect(mockClick).toHaveBeenCalledTimes(0);

		await userEvent.click(outside1);

		expect(mockClick).toHaveBeenCalledTimes(1);

		await userEvent.click(outside2);

		expect(mockClick).toHaveBeenCalledTimes(2);

		await userEvent.click(main);

		expect(mockClick).toHaveBeenCalledTimes(2);

		const mockClick2 = vi.fn();

		rerender(<TestComponent onClickOutside={mockClick2} />);

		await userEvent.click(outside1);
		expect(mockClick).toHaveBeenCalledTimes(2);
		expect(mockClick2).toHaveBeenCalledTimes(1);
	});
});
