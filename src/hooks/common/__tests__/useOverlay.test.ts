import { useOverlay } from '@hooks/common/useOverlay';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

describe('useOverlay.test > ', () => {
	test('useOverlay에 대해 테스트 해보기', () => {
		const { result } = renderHook(() => useOverlay());

		// 초기에는 open 상태가 false이다.
		expect(result.current.isOpen).toEqual(false);

		// open을 실행하면
		act(() => {
			result.current.open();
		});

		// true가 되고
		expect(result.current.isOpen).toEqual(true);

		// close를 실행하면
		act(() => {
			result.current.close();
		});

		// false가 되고
		expect(result.current.isOpen).toEqual(false);

		// toggle을 실행하면, true -> false, false -> true 로 변경된다.
		act(() => {
			result.current.toggle();
		});

		expect(result.current.isOpen).toEqual(true);

		act(() => {
			result.current.toggle();
		});

		expect(result.current.isOpen).toEqual(false);
	});
});
