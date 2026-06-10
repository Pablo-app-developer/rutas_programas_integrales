import { useState, useEffect } from 'react'
import { loadDashboardData } from '../utils/parseExcel.js'

export function useData() {
  const [state, setState] = useState({ data12: [], data18: [], loading: true, error: null })

  useEffect(() => {
    loadDashboardData()
      .then(({ data12, data18 }) => setState({ data12, data18, loading: false, error: null }))
      .catch(err => setState(s => ({ ...s, loading: false, error: err.message })))
  }, [])

  const reemplazarDatos = ({ data12, data18 }) =>
    setState({ data12, data18, loading: false, error: null })

  return { ...state, reemplazarDatos }
}
