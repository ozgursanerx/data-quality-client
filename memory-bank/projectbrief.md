# Project Brief: Flowlytics

## Overview
This is a React-based data flow analytics and management application built on the CoreUI framework. The system focuses on analyzing jobs, procedures, and packages based on a logging table used by a data warehouse team.

## Core Purpose
- **Data Flow Analytics**: Comprehensive analysis of data warehouse operations through logging data
- **Visual Data Lineage**: Interactive visualization of data dependencies and transformations
- **Performance Monitoring**: Real-time and historical performance analysis
- **Anomaly Detection**: Automated detection of unusual patterns in data processing
- **Package Management**: Centralized management of data warehouse packages and procedures

## System Hierarchy
The application operates on a three-tier hierarchy:
- **Packages** contain procedures (identified by unique PROG_ID)
- **Procedures** contain steps
- **Steps** within the same procedure share a common prefix pattern (differ only by -10, -20, -30 suffix)

## Key Features

### Data Visualization
- Interactive data lineage graphs using ReactFlow
- D3.js-powered advanced visualizations
- Real-time monitoring dashboards
- Performance metrics and trends

### Analysis Capabilities
- Backward tracing of data dependencies
- Forward impact analysis
- Cross-package dependency mapping
- Execution performance analysis

### User Interface
- Modern React 19 with CoreUI 5.x professional template
- Responsive design for desktop and mobile
- Dark/light theme support
- Advanced filtering and search capabilities

### Integration
- MCP (Model Context Protocol) server integration
- RESTful API backend
- Real-time data processing
- Export capabilities (JSON, CSV)

## Technical Foundation
- **Frontend**: React 19, CoreUI 5.x, ReactFlow, D3.js
- **Backend**: Node.js, Express, MCP Protocol
- **Build**: Vite for fast development and optimized builds
- **Styling**: SCSS with CoreUI design system

## Target Users
- Data warehouse administrators
- ETL developers
- Data quality analysts
- Business intelligence teams
- Database administrators 