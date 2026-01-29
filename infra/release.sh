#!/bin/bash
# Initialize an indexed array for key-value pairs
VARS=()

# Function Definitions
printSeparator() {
    echo -e ""
    echo -e ""
}

printColored() {
    printf "\e[38;2;248;138;0m%s \e[0m\n" "$1"
}

printError() {
    printf "\e[38;2;255;0;0m%s\e[0m\n" "$1"
}

printListItem() {
    CHECK_MARK="\e[38;2;0;255;0m\xE2\x9C\x94\e[0m"
    echo -e "${CHECK_MARK} $1"
}

printHeader() {
    clear
    printColored "-----------------------------------"
    printColored "       NEXGENSPEAK BACKEND INNOVATION LABS         "
    printColored "-----------------------------------"
}

collectInput() {
    local prompt="$1"
    local var_name="$2"
    printHeader
    printSeparator
    printColored "NexgenSpeak Backend CLI"
    printSeparator
    echo -n "$prompt"
    read -r "$var_name"
}

# Collect Country Code, Services and Environment
collectCountryCode() {
    while true; do
        collectInput "Enter Country Code (vn): " CountryCode
        if [[ $CountryCode == "vn" ]]; then 
            break
        else
            printError "Invalid country code, try again after 1 second."
            sleep 1
        fi
    done
    printSeparator
}

collectEnvironment() {
    while true; do
        collectInput "Enter Environment Code (dev, uat, prod): " EnvironmentCode
        if [[ $EnvironmentCode == "dev" || $EnvironmentCode == "uat" || $EnvironmentCode == "prod" ]]; then
            break
        else
            printError "Invalid environment, try again after 1 second."
            sleep 1
        fi
    done
    printSeparator
}

# Load all variables from an environment file into VARS indexed array


loadCountryVars() {
    local env_file="../envs/${CountryCode}/${EnvironmentCode}.env"

    if [[ -f "$env_file" ]]; then
        while IFS='=' read -r key value; do
            # Skip empty lines and comments
            [[ -z "$key" || "$key" =~ ^# ]] && continue
            # Trim whitespace and remove surrounding quotes from key and value
            key=$(echo "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | sed 's/^"\(.*\)"$/\1/')
            VARS+=("$key=$value")
        done < "$env_file"
    else
        printError "Environment file not found: $env_file"
        exit 1
    fi
    # Add dynamically fetched variables to VARS
    # TODO
}

# Helper function to get a variable from VARS
getVar() {
    local search_key="$1"
    for pair in "${VARS[@]}"; do
        if [[ "$pair" =~ ^$search_key= ]]; then
            echo "${pair#*=}"
            return
        fi
    done
}

# Verify Installation and Print Config
verifyInstallation() {
    loadCountryVars
    printHeader
    printSeparator
    printColored "NexgenSpeak Backend - Configuration Verification"
    printSeparator
    printListItem "EnvironmentCode = ${EnvironmentCode}"
    printListItem "CountryCode = ${CountryCode}"

    for pair in "${VARS[@]}"; do
        printListItem "$pair"
    done
    printSeparator
    echo -n "Do you want to continue? ([Y]es, [N]o): "
    read -r CONFIRM_CODE

    if [[ $CONFIRM_CODE != "Y" && $CONFIRM_CODE != "y" ]]; then
    clear;

    printHeader
    printSeparator
    printError "Aborting deployment in 3 seconds... ";
    sleep 1;
    printError "Aborting deployment in 2 seconds... ";
    sleep 1;
    printError "Aborting deployment in 1 seconds... ";
    sleep 1;
    printSeparator
    clear;
    exit 1
    fi
}

# Construct sam deploy parameter overrides dynamically
constructParameterOverrides() {
    # TODO
    # Adding other parameters from the environment file
    for pair in "${VARS[@]}"; do
        key="${pair%%=*}"
        value="${pair#*=}"
        parameter_overrides+=" ParameterKey=$key,ParameterValue=$value"
    done

    echo "$parameter_overrides"
}

installAllDependencies() {
    echo "Scanning for Node.js dependencies..."
    find . -name "package.json" -type f -not -path "./node_modules/*" | while IFS= read -r -d '' pkg_file; do
        dir=$(dirname "$pkg_file")
        echo "Found package.json in $dir"
        cd "$dir"
        echo "Installing dependencies in : $(pwd)"
        npm install
        cd - > /dev/null
        echo "Return to : $(pwd)"
    done
}

# Main Deployment Logic
runDeployment() {
    verifyInstallation
    installAllDependencies
    # Build SAM project
    sam.cmd build --template-file ./release.yaml

    # Run SAM deploy with dynamic parameters
    local parameter_overrides
    parameter_overrides=$(constructParameterOverrides)
    
     # Check DcpEnv and set ARTIFACT_STORE and AWS_CLI_PROFILE accordingly
    local aws_artifact_store
    local aws_cli_profile
    local aws_artifact_path
    local aws_stack_name
    local aws_region 
    if [[ $(getVar DcpEnv) == "true" ]]; then
        aws_cli_profile=$(getVar DcpCliProfile)
        aws_artifact_store=$(getVar DcpS3CfBucket)
        aws_artifact_path=$(getVar ArtifactPath)
        aws_stack_name=$(getVar AwsStackName)
        aws_region=$(getVar AwsRegion)

    else
        aws_cli_profile=$(getVar AwsCliProfile)
        aws_artifact_store=$(getVar ArtifactStore)
        aws_artifact_path=$(getVar ArtifactPath)
        aws_stack_name=$(getVar AwsStackName)
        aws_region=$(getVar AwsRegion)
    fi

    sam.cmd deploy --template-file ./.aws-sam/build/template.yaml \
        --profile  $aws_cli_profile  \
        --s3-bucket $aws_artifact_store \
        --s3-prefix  $aws_artifact_path  \
        --stack-name $aws_stack_name \
        --region $aws_region \
        --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
        --parameter-overrides $parameter_overrides
}

# Execution flow
collectCountryCode
collectEnvironment
runDeployment

# Done
printSeparator
echo "Deployment complete!"
printSeparator
read -n 1 -s -r -p "Press any key to continue..."
clear