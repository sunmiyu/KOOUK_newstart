'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { UserUsage, PLAN_LIMITS } from '@/types/folder'
import { useAuth } from './useAuth'

interface DatabaseUsage {
  user_id: string
  plan: 'free' | 'pro'
  current_storage_mb: number
  current_folders: number
  current_marketplace_folders: number
  storage_usage_percent: number
  folder_usage_percent: number
  marketplace_usage_percent: number
  is_storage_warning: boolean
  is_storage_full: boolean
  is_folders_full: boolean
  last_calculated_at: string
}

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
      const { data: calculatedUsage, error: rpcError } = await supabase.rpc('calculate_user_usage', {
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
        const usageData = basicUsage as DatabaseUsage | null
        const plan = (usageData?.plan || 'free') as 'free' | 'pro'
        setUsage({
          user_id: user.id,
          plan: plan,
          current_storage_mb: usageData?.current_storage_mb || 0,
          current_folders: usageData?.current_folders || 0,
          current_marketplace_folders: usageData?.current_marketplace_folders || 0,
          limits: PLAN_LIMITS[plan],
          storage_usage_percent: usageData?.storage_usage_percent || 0,
          folder_usage_percent: usageData?.folder_usage_percent || 0,
          marketplace_usage_percent: usageData?.marketplace_usage_percent || 0,
          is_storage_warning: usageData?.is_storage_warning || false,
          is_storage_full: usageData?.is_storage_full || false,
          is_folders_full: usageData?.is_folders_full || false,
          last_calculated_at: usageData?.last_calculated_at || new Date().toISOString()
        })
      } else {
        // RPC 호출 성공 - 결과를 사용량 인터페이스에 맞게 변환
        const rpcData = calculatedUsage as UserUsage | null
        if (rpcData) {
          setUsage({
            user_id: user.id,
            plan: rpcData.plan,
            current_storage_mb: rpcData.current_storage_mb,
            current_folders: rpcData.current_folders,
            current_marketplace_folders: rpcData.current_marketplace_folders,
            limits: rpcData.limits,
            storage_usage_percent: rpcData.storage_usage_percent,
            folder_usage_percent: rpcData.folder_usage_percent,
            marketplace_usage_percent: rpcData.marketplace_usage_percent,
            is_storage_warning: rpcData.is_storage_warning,
            is_storage_full: rpcData.is_storage_full,
            is_folders_full: rpcData.is_folders_full,
            last_calculated_at: rpcData.last_calculated_at
          })
        }
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