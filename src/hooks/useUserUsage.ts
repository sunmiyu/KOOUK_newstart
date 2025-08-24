'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { UserUsage, PLAN_LIMITS } from '@/types/folder'
import { useAuth } from './useAuth'

export function useUserUsage() {
  const { user } = useAuth()
  const [usage, setUsage] = useState<UserUsage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseClient()

  const fetchUsage = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Supabase 함수 호출하여 최신 사용량 계산
      const { data: calculatedUsage, error: rpcError } = await (supabase as any).rpc('calculate_user_usage', {
        target_user_id: user.id
      })

      if (rpcError) {
        console.error('RPC error:', rpcError)
        // RPC 에러가 있어도 기본 user_usage 테이블에서 조회 시도
        const { data: basicUsage, error: selectError } = await supabase
          .from('user_usage')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (selectError) {
          throw new Error('사용량 정보를 가져올 수 없습니다.')
        }

        // 기본값으로 사용량 구성
        const plan = ((basicUsage as any)?.plan || 'free') as 'free' | 'pro'
        setUsage({
          user_id: user.id,
          plan: plan,
          current_storage_mb: (basicUsage as any)?.current_storage_mb || 0,
          current_folders: (basicUsage as any)?.current_folders || 0,
          current_marketplace_folders: (basicUsage as any)?.current_marketplace_folders || 0,
          limits: PLAN_LIMITS[plan],
          storage_usage_percent: (basicUsage as any)?.storage_usage_percent || 0,
          folder_usage_percent: (basicUsage as any)?.folder_usage_percent || 0,
          marketplace_usage_percent: (basicUsage as any)?.marketplace_usage_percent || 0,
          is_storage_warning: (basicUsage as any)?.is_storage_warning || false,
          is_storage_full: (basicUsage as any)?.is_storage_full || false,
          is_folders_full: (basicUsage as any)?.is_folders_full || false,
          last_calculated_at: (basicUsage as any)?.last_calculated_at || new Date().toISOString()
        })
      } else {
        // RPC 호출 성공 - 결과를 사용량 인터페이스에 맞게 변환
        setUsage({
          user_id: user.id,
          plan: calculatedUsage.plan,
          current_storage_mb: calculatedUsage.current_storage_mb,
          current_folders: calculatedUsage.current_folders,
          current_marketplace_folders: calculatedUsage.current_marketplace_folders,
          limits: calculatedUsage.limits,
          storage_usage_percent: calculatedUsage.storage_usage_percent,
          folder_usage_percent: calculatedUsage.folder_usage_percent,
          marketplace_usage_percent: calculatedUsage.marketplace_usage_percent,
          is_storage_warning: calculatedUsage.is_storage_warning,
          is_storage_full: calculatedUsage.is_storage_full,
          is_folders_full: calculatedUsage.is_folders_full,
          last_calculated_at: calculatedUsage.last_calculated_at
        })
      }
    } catch (err) {
      console.error('Usage fetch error:', err)
      setError(err instanceof Error ? err.message : '사용량 정보를 가져올 수 없습니다.')
      
      // 에러 시 기본값 설정
      setUsage({
        user_id: user.id,
        plan: 'free',
        current_storage_mb: 0,
        current_folders: 0,
        current_marketplace_folders: 0,
        limits: PLAN_LIMITS.free,
        storage_usage_percent: 0,
        folder_usage_percent: 0,
        marketplace_usage_percent: 0,
        is_storage_warning: false,
        is_storage_full: false,
        is_folders_full: false,
        last_calculated_at: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  // 사용량 새로고침
  const refreshUsage = () => {
    fetchUsage()
  }

  useEffect(() => {
    fetchUsage()
  }, [user])

  // 실시간 업데이트 구독 (선택적)
  useEffect(() => {
    if (!user) return

    const subscription = supabase
      .channel(`usage_updates_${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_usage',
        filter: `user_id=eq.${user.id}`
      }, () => {
        // 사용량이 변경되면 새로고침
        fetchUsage()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  return {
    usage,
    loading,
    error,
    refreshUsage,
    clearError: () => setError(null)
  }
}