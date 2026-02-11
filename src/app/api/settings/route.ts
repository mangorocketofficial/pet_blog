import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Settings interface
interface Settings {
  id: number
  categories: string[]
  site_name: string
  site_description: string
  created_at: string
  updated_at: string
}

// Create admin client with service role key
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Get settings
export async function GET() {
  try {
    const supabase = createAdminClient()

    if (!supabase) {
      return NextResponse.json({
        error: 'Missing Supabase configuration',
      }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      // If settings table doesn't exist or no data, return defaults
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return NextResponse.json({
          settings: {
            id: 1,
            categories: ['배변·위생', '급식·급수', '외출·이동', '미용·위생', '실내환경', '놀이·운동', '훈련·교육', '관상어·수족관', '스마트·모니터링', '기타'],
            site_name: '펫부산',
            site_description: '반려동물 용품 리뷰와 비용 분석',
          }
        })
      }
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ settings: data as Settings })
  } catch (err) {
    console.error('Settings GET error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to get settings' },
      { status: 500 }
    )
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    if (!supabase) {
      return NextResponse.json({
        error: 'Missing Supabase configuration',
      }, { status: 500 })
    }

    const body = await request.json()
    const { categories, site_name, site_description } = body

    // Build update object with only provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}

    if (categories !== undefined) {
      if (!Array.isArray(categories)) {
        return NextResponse.json({ error: 'categories must be an array' }, { status: 400 })
      }
      updateData.categories = categories
    }

    if (site_name !== undefined) {
      updateData.site_name = site_name
    }

    if (site_description !== undefined) {
      updateData.site_description = site_description
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Try to update existing settings
    const { data, error } = await supabase
      .from('settings')
      .update(updateData)
      .eq('id', 1)
      .select()
      .single()

    if (error) {
      // If no row exists, try to insert
      if (error.code === 'PGRST116') {
        const { data: insertData, error: insertError } = await supabase
          .from('settings')
          .insert({
            id: 1,
            categories: categories || ['기타'],
            site_name: site_name || '블로그',
            site_description: site_description || '',
          })
          .select()
          .single()

        if (insertError) {
          console.error('Supabase insert error:', insertError)
          return NextResponse.json({ error: insertError.message }, { status: 500 })
        }

        return NextResponse.json({ settings: insertData, message: 'Settings created' })
      }

      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ settings: data, message: 'Settings updated' })
  } catch (err) {
    console.error('Settings PUT error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update settings' },
      { status: 500 }
    )
  }
}
