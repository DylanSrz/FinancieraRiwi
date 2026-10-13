#!/usr/bin/env bash
# Publica el mensaje de la daily en el canal #daily de Discord.
# Uso: DISCORD_WEBHOOK_DAILY=<url> bash .github/scripts/daily-discord.sh   (DRY_RUN=1 solo imprime el mensaje)
set -euo pipefail

DIA=${DIA:-$(TZ=America/Bogota date +%u)} # 1 = lunes … 7 = domingo
DIAS=(lunes martes miércoles jueves viernes sábado domingo)
MESES=(enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre)
FECHA="${DIAS[$((DIA - 1))]} $(TZ=America/Bogota date +%-d) de ${MESES[$(($(TZ=America/Bogota date +%-m) - 1))]}"

EQUIPO_IDS=(591497049904775178 407284291383590912 407779148874907648 683389228817973328) # Dylan, Nesdael, Kerin, Diego (Gonza)
SCRUM_MASTER=407284291383590912
EQUIPO=$(printf '<@%s> ' "${EQUIPO_IDS[@]}")
BLOQUEOS='<#1559587343780814902>'
TABLERO='https://github.com/users/DylanSrz/projects/9'

case "$DIA" in
  2 | 4)
    if [ "$DIA" = 2 ]; then
      AGENDA="• **1:00 p. m.** Daily presencial (10 min)
• **3:15 p. m.** Sprint Review: demo de lo terminado
• **3:40 p. m.** Retrospectiva"
    else
      AGENDA="• **1:00 p. m.** Sprint Planning (30 min): objetivo del sprint y asignación de historias
• **1:30 p. m.** Daily presencial (10 min)"
    fi
    MENSAJE="🏫 **Clase de hoy — ${FECHA}** · 1:00 a 4:00 p. m.
${EQUIPO}
${AGENDA}

Lleven su tablero al día antes de la clase: ${TABLERO}
Al terminar, <@${SCRUM_MASTER}> deja aquí el resumen de la daily y sube el acta a \`docs/proceso/actas/\`."
    ;;
  1 | 3 | 5)
    MENSAJE="☀️ **Daily asíncrona — ${FECHA}**
${EQUIPO}
Respondan en este canal antes de las **12:00 m.**:
1️⃣ ¿Qué hice desde la última daily?
2️⃣ ¿Qué voy a hacer hoy? (con el # del issue)
3️⃣ ¿Tengo algún bloqueo? Si es así, publíquenlo también en ${BLOQUEOS}

📋 Tablero: ${TABLERO}"
    ;;
  *)
    echo "Fin de semana: sin daily."
    exit 0
    ;;
esac

PAYLOAD=$(jq -n --arg c "$MENSAJE" --argjson ids "$(printf '%s\n' "${EQUIPO_IDS[@]}" | jq -R . | jq -s .)" \
  '{username: "Daily Scrum", content: $c, allowed_mentions: {parse: [], users: $ids}}')

if [ "${DRY_RUN:-0}" = 1 ]; then
  echo "$PAYLOAD"
  exit 0
fi

: "${DISCORD_WEBHOOK_DAILY:?Falta el secreto DISCORD_WEBHOOK_DAILY}"
curl --fail-with-body -sS -H 'Content-Type: application/json' -d "$PAYLOAD" "$DISCORD_WEBHOOK_DAILY"
echo "Mensaje de la daily publicado (día $DIA)."
