import { PropsWithChildren } from 'react';
import * as getFeedsModules from '@apis/Feed/getFeeds';
import useFeedsQuery from '@hooks/queries/Feed/useFeedsQuery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

// 테스트용 쿼리 클라이언트 설정
const testQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: 0,
		},
	},
});

function QueryProviderWrapperForTest({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={testQueryClient}>
			{children}
		</QueryClientProvider>
	);
}

vi.mock('@apis/Feed/getFeeds');

describe('useFeedsQuery.test > ', () => {
	test('테스트', async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		getFeedsModules.getFeeds.mockImplementation(async () => {
			await new Promise((resolve) => {
				setTimeout(resolve, 100);
			}); // 100ms 지연 추가
			console.log('getFeeds 호출!');
			return {
				pages: [],
				pageParams: [],
			};
		});
		const { result } = renderHook(
			() =>
				useFeedsQuery({
					teamspaceId: 1,
					type: 'NORMAL',
				}),
			{
				wrapper: QueryProviderWrapperForTest,
			}
		);

		expect(result.current.feeds).toEqual(undefined);
		expect(result.current.hasNextPage).toEqual(false);
		expect(result.current.isFetching).toEqual(true);
		expect(getFeedsModules.getFeeds).toHaveBeenCalledTimes(1);
		expect(getFeedsModules.getFeeds).toHaveBeenCalledWith({
			teamspaceId: 1,
			type: 'NORMAL',
		});

		await waitFor(() => expect(result.current.feeds).toBe([]));

		expect(result.current.hasNextPage).toEqual(false);
		expect(result.current.isFetching).toEqual(true);
	});
});
