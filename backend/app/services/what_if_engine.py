from app.models.schemas import WhatIfRequest, WhatIfResponse
from app.services.dataset_service import dataset_service, get_risk_category

class WhatIfEngine:
    def simulate_scenario(self, req: WhatIfRequest) -> WhatIfResponse:
        live = dataset_service.get_live_aqi(req.station_id)
        
        base_pm25 = live.pm25
        base_wind = live.wind_speed
        base_humidity = live.humidity
        base_temp = live.temperature
        
        # Scenario adjustments
        sim_wind = max(0.5, base_wind * (1.0 + req.wind_speed_change_pct / 100.0))
        sim_humidity = max(10.0, min(100.0, base_humidity * (1.0 + req.humidity_change_pct / 100.0)))
        sim_temp = base_temp + req.temp_change_deg
        stubble_mult = max(1.0, req.stubble_burning_factor)

        # Dispersion physics & coupled AI response formula:
        # 1. Wind impact: Dispersion is proportional to wind speed. Lower wind = higher accumulation.
        wind_factor = (base_wind + 1.0) / (sim_wind + 1.0)
        
        # 2. Humidity impact: Higher relative humidity promotes secondary inorganic aerosol formation (sulfate/nitrate hygroscopic growth).
        humidity_factor = 1.0 + ((sim_humidity - base_humidity) / 100.0) * 0.45
        
        # 3. Temp inversion impact: Lower temp traps pollutants in shallow planetary boundary layer.
        temp_factor = 1.0 + max(0, (base_temp - sim_temp)) * 0.025

        # Combined AI Scenario Multiplier
        scenario_multiplier = wind_factor * humidity_factor * temp_factor * stubble_mult
        
        simulated_pm25 = round(base_pm25 * scenario_multiplier, 1)
        delta_pm25 = round(simulated_pm25 - base_pm25, 1)
        delta_pct = round((delta_pm25 / base_pm25) * 100.0, 1)

        sim_aqi = int(simulated_pm25 * 1.48)
        base_risk, _ = get_risk_category(live.aqi)
        sim_risk, _ = get_risk_category(sim_aqi)

        sim_forecast_6h = round(simulated_pm25 * 1.15, 1)

        # Build environmental scientific explanations
        explanations = []
        if req.wind_speed_change_pct < 0:
            explanations.append(f"🌬️ Wind speed decrease of {abs(req.wind_speed_change_pct):.0f}% limits horizontal ventilation, leading to local accumulation of PM2.5.")
        elif req.wind_speed_change_pct > 0:
            explanations.append(f"💨 Wind speed increase of {req.wind_speed_change_pct:.0f}% enhances atmospheric dispersion and dilutes particulate matter.")

        if req.humidity_change_pct > 0:
            explanations.append(f"💧 Humidity increase of {req.humidity_change_pct:.0f}% promotes hygroscopic growth of fine particulates and secondary aerosol formation.")
        
        if req.stubble_burning_factor > 1.0:
            explanations.append(f"🔥 Stubble burning multiplier ({req.stubble_burning_factor:.1f}x) injects heavy agricultural biomass smoke into NCR air mass.")

        if not explanations:
            explanations.append("Parameters match baseline real-time conditions.")

        summary_text = f"Under simulated conditions, PM2.5 changes by {delta_pm25:+.1f} µg/m³ ({delta_pct:+.1f}%), shifting AQI from {live.aqi} ({base_risk}) to {sim_aqi} ({sim_risk})."

        return WhatIfResponse(
            station_id=req.station_id,
            station_name=live.station_name,
            baseline_pm25=base_pm25,
            simulated_pm25=simulated_pm25,
            delta_pm25=delta_pm25,
            delta_pct=delta_pct,
            baseline_aqi=live.aqi,
            simulated_aqi=sim_aqi,
            baseline_risk=base_risk,
            simulated_risk=sim_risk,
            simulated_forecast_6h=sim_forecast_6h,
            weather_explanation=summary_text,
            contributing_factors=explanations
        )

what_if_engine = WhatIfEngine()
