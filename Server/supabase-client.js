{/* <script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

  const supabase = createClient(
    'https://qbmfbbqdcovjkjpniqdj.supabase.co',
    'sb_publishable_673ZLU1grtbPnewvti7SjA_gOuFPwzk'
  )

  // Now you can use it
  const { data, error } = await supabase.from('machines').select('*')
  console.log(data, error)
</script> */}

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const supabase = createClient('https://qbmfbbqdcovjkjpniqdj.supabase.co', 'sb_publishable_673ZLU1grtbPnewvti7SjA_gOuFPwzk')