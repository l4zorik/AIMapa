#!/bin/bash

# Skript pro spuštění testů AIMapa
# Verze 0.3.8.6

# Barvy pro výstup
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkce pro zobrazení nápovědy
show_help() {
    echo -e "${BLUE}AIMapa Test Runner${NC}"
    echo "Verze 0.3.8.6"
    echo ""
    echo "Použití: $0 [MOŽNOSTI]"
    echo ""
    echo "Možnosti:"
    echo "  -a, --all         Spustit všechny testy"
    echo "  -u, --unit        Spustit unit testy"
    echo "  -i, --integration Spustit integrační testy"
    echo "  -e, --e2e         Spustit end-to-end testy"
    echo "  -m, --ai-model    Spustit testy AI modelu"
    echo "  -h, --help        Zobrazit tuto nápovědu"
    echo ""
    echo "Příklady:"
    echo "  $0 --all          # Spustit všechny testy"
    echo "  $0 -u -i          # Spustit unit a integrační testy"
}

# Kontrola, zda je Node.js nainstalován
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Chyba: Node.js není nainstalován${NC}"
        echo "Nainstalujte Node.js a zkuste to znovu"
        exit 1
    fi
}

# Kontrola, zda jsou nainstalovány potřebné balíčky
check_dependencies() {
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Chyba: npm není nainstalován${NC}"
        echo "Nainstalujte npm a zkuste to znovu"
        exit 1
    fi
    
    # Kontrola, zda je nainstalován modul jest
    if ! npm list -g jest &> /dev/null; then
        echo -e "${YELLOW}Varování: Jest není nainstalován globálně${NC}"
        echo "Instaluji Jest..."
        npm install -g jest
    fi
}

# Spuštění unit testů
run_unit_tests() {
    echo -e "${BLUE}=== SPOUŠTÍM UNIT TESTY ===${NC}"
    node -e "const MapUtilsTest = require('./unit/map-utils.test'); const results = MapUtilsTest.runAllTests(); console.log(JSON.stringify(results, null, 2));"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Unit testy dokončeny úspěšně${NC}"
    else
        echo -e "${RED}Unit testy selhaly${NC}"
    fi
}

# Spuštění integračních testů
run_integration_tests() {
    echo -e "${BLUE}=== SPOUŠTÍM INTEGRAČNÍ TESTY ===${NC}"
    node -e "const MapApiTest = require('./integration/map-api.test'); MapApiTest.runAllTests().then(results => console.log(JSON.stringify(results, null, 2)));"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Integrační testy dokončeny úspěšně${NC}"
    else
        echo -e "${RED}Integrační testy selhaly${NC}"
    fi
}

# Spuštění end-to-end testů
run_e2e_tests() {
    echo -e "${BLUE}=== SPOUŠTÍM END-TO-END TESTY ===${NC}"
    node -e "const MapWorkflowTest = require('./e2e/map-workflow.test'); MapWorkflowTest.runAllScenarios().then(results => console.log(JSON.stringify(results, null, 2)));"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}End-to-end testy dokončeny úspěšně${NC}"
    else
        echo -e "${RED}End-to-end testy selhaly${NC}"
    fi
}

# Spuštění testů AI modelu
run_ai_model_tests() {
    echo -e "${BLUE}=== SPOUŠTÍM TESTY AI MODELU ===${NC}"
    node -e "const AIModelTest = require('./ai/model-evaluation.test'); const results = AIModelTest.runAllTests(); console.log(JSON.stringify(results, null, 2));"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Testy AI modelu dokončeny úspěšně${NC}"
    else
        echo -e "${RED}Testy AI modelu selhaly${NC}"
    fi
}

# Spuštění všech testů
run_all_tests() {
    echo -e "${BLUE}=== SPOUŠTÍM VŠECHNY TESTY ===${NC}"
    node run-tests.js
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Všechny testy dokončeny úspěšně${NC}"
    else
        echo -e "${RED}Některé testy selhaly${NC}"
    fi
}

# Hlavní funkce
main() {
    # Kontrola Node.js a závislostí
    check_node
    check_dependencies
    
    # Pokud nejsou zadány žádné parametry, zobrazit nápovědu
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi
    
    # Zpracování parametrů
    RUN_UNIT=false
    RUN_INTEGRATION=false
    RUN_E2E=false
    RUN_AI_MODEL=false
    RUN_ALL=false
    
    while [ "$1" != "" ]; do
        case $1 in
            -a | --all )          RUN_ALL=true
                                  ;;
            -u | --unit )         RUN_UNIT=true
                                  ;;
            -i | --integration )  RUN_INTEGRATION=true
                                  ;;
            -e | --e2e )          RUN_E2E=true
                                  ;;
            -m | --ai-model )     RUN_AI_MODEL=true
                                  ;;
            -h | --help )         show_help
                                  exit 0
                                  ;;
            * )                   echo -e "${RED}Neznámý parametr: $1${NC}"
                                  show_help
                                  exit 1
        esac
        shift
    done
    
    # Spuštění testů
    if [ "$RUN_ALL" = true ]; then
        run_all_tests
    else
        if [ "$RUN_UNIT" = true ]; then
            run_unit_tests
        fi
        
        if [ "$RUN_INTEGRATION" = true ]; then
            run_integration_tests
        fi
        
        if [ "$RUN_E2E" = true ]; then
            run_e2e_tests
        fi
        
        if [ "$RUN_AI_MODEL" = true ]; then
            run_ai_model_tests
        fi
    fi
}

# Spuštění hlavní funkce
main "$@"
