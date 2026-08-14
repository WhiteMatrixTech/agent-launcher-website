import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import ClaudeCode from '@lobehub/icons/es/ClaudeCode'
import Codex from '@lobehub/icons/es/Codex'
import GeminiCLI from '@lobehub/icons/es/GeminiCLI'
import HermesAgent from '@lobehub/icons/es/HermesAgent'
import OpenCode from '@lobehub/icons/es/OpenCode'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleDot,
  Download,
  ExternalLink,
  FileCode2,
  Folder,
  FolderCog,
  FolderOpen,
  Globe2,
  History,
  KeyRound,
  Link2,
  Menu,
  MonitorCog,
  PackageCheck,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings2,
  ServerCog,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TerminalSquare,
  Trash2,
  X
} from 'lucide-react'

type Locale = 'zh' | 'en'
type Platform = 'mac' | 'windows' | 'linux' | 'other'
type DemoCliId = 'claude-code' | 'codex' | 'opencode' | 'pi' | 'gemini' | 'hermes'

const GITHUB_URL = 'https://github.com/WhiteMatrixTech/agent-launcher'
const RELEASES_URL = `${GITHUB_URL}/releases`

const copy = {
  zh: {
    nav: { features: '功能', agents: '支持的 Agent', privacy: '本地与隐私', faq: '常见问题' },
    hero: {
      eyebrow: '本地桌面工作台',
      title: 'Agent Launcher',
      lead: '六个编程 Agent，一个本地入口。',
      steps: ['一键安装', '一键配置', '一键启动'],
      body: '自动检测本地 CLI：缺失时提供安装，已存在则直接关联；选择 API 配置后，即可新建会话，或从 CLI 的本地历史中恢复。',
      release: '查看 GitHub Releases',
      github: '查看源代码',
      note: '支持 macOS、Windows 与 Linux',
      current: '最新版本'
    },
    trust: ['已有 CLI 不重装', '原生配置自动同步', '本地会话历史', 'MIT 开源'],
    agents: {
      label: '一个入口，六个 Agent',
      title: '保留你熟悉的 CLI，省掉重复配置。',
      body: 'Agent Launcher 启动的仍然是各项目自己的命令行工具。已有安装继续使用原路径、配置目录与会话记录。'
    },
    showcase: {
      label: '真实应用界面',
      title: '从关联到会话，工作流都在一个窗口里。',
      tabs: ['工作区', '多套配置', 'MCP 与 Skills', '本地用量'],
      items: [
        {
          title: '项目与历史会话',
          body: '按 CLI 查看它保存在本机的历史记录和关联目录，在内置终端中启动新会话，或恢复已有会话。'
        },
        {
          title: '服务商配置与连通性检查',
          body: '为每个 Agent 保存多套账号或 API 配置；切换后同步对应环境变量与原生配置文件，并用最小真实请求检查连通性。'
        },
        {
          title: '查看已安装的 MCP 与 Skills',
          body: '直接检查 CLI 原生配置中已有的 MCP 服务与 Skills。应用只负责读取展示，不会从远程目录擅自安装 Skills。'
        },
        {
          title: '本地会话用量汇总',
          body: '从本地历史记录汇总 token、请求、会话和模型分布；数据不会上传到独立的统计服务。'
        }
      ]
    },
    workflow: {
      label: '开始使用',
      title: '一键安装、配置、启动。',
      items: [
        ['一键安装', '自动检测系统中的 CLI；缺失时调用该 CLI 的官方安装方式，已存在则直接关联，不重装、不升级。'],
        ['一键配置', '选择官方账号或兼容 API 配置，自动写入该 CLI 读取的环境变量与原生配置文件，并用真实请求检查连通性。'],
        ['一键启动', '一键在内置终端或聊天视图中开始新会话，也可以从本地历史中恢复已有会话。']
      ]
    },
    details: {
      label: '为日常工作准备',
      title: '不替换 CLI，只把它们组织好。',
      items: [
        ['已有安装保持原样', '每次安装前都会重新检测。只要找到现有命令，就只关联，不重装、不修复、不升级。'],
        ['原生配置同步', '支持 Claude Code、Codex、OpenCode、Pi 与 Hermes 的文件配置；Gemini 使用环境变量。'],
        ['跨格式会话历史', '读取各 CLI 自己的 JSONL、JSON 或 SQLite 历史，并按其原生参数恢复会话。'],
        ['危险模式明确可控', '支持的 CLI 可以单独开启自动批准；Pi 本身不提示审批，因此没有多余开关。']
      ]
    },
    privacy: {
      label: '本地为先，而非离线伪装',
      title: '本机数据留在本机，模型请求去往你选择的服务。',
      body: 'Agent Launcher 在本机读取会话、配置与用量，不接入独立分析服务。运行 Agent 时，请求会发送到当前配置中的官方服务或中转接口；版本检查可能访问 GitHub、npm 或 PyPI。',
      keyTitle: '关于 API Key',
      keyBody: '密钥按产品设计以明文保存在 ~/.agent-launcher/config.json，必要时也会写入 CLI 原生配置。界面会遮盖密钥，但本机用户仍可读取这些文件。'
    },
    download: {
      title: '把六个 Agent 放进一个工作台。',
      body: '从 GitHub Releases 获取适用于 macOS、Windows 或 Linux 的安装包。',
      action: '前往下载',
      source: '阅读 README'
    },
    faq: {
      label: '常见问题',
      title: '边界说清楚，使用更放心。',
      items: [
        ['一键安装会覆盖我现有的 CLI 吗？', '不会。Agent Launcher 优先关联已存在的命令；一键安装只在完全找不到该 CLI 时出现，不会升级或修改已有安装。'],
        ['数据保存在哪里？', '应用状态保存在 ~/.agent-launcher/。关联的系统 CLI 继续使用它们自己的配置与历史目录。'],
        ['支持哪些安装包？', 'macOS 提供 Intel 与 Apple 芯片的 DMG/ZIP，Windows 使用 NSIS 安装包，Linux 使用 AppImage。具体可用文件以 GitHub Releases 为准。'],
        ['这是完全离线的应用吗？', '不是。配置、历史与统计主要在本机处理，但 Agent 请求会发往你选择的模型服务，版本检查也可能访问公开软件源。']
      ]
    },
    footer: { description: '配置和运行现有编程 Agent CLI 的本地桌面工作台。', license: 'MIT License', issues: '问题反馈' },
    platform: { mac: 'macOS', windows: 'Windows', linux: 'Linux', other: '桌面端' }
  },
  en: {
    nav: { features: 'Features', agents: 'Agents', privacy: 'Local & private', faq: 'FAQ' },
    hero: {
      eyebrow: 'Local desktop workspace',
      title: 'Agent Launcher',
      lead: 'Six coding agents. One local entry point.',
      steps: ['One-click install', 'One-click configure', 'One-click launch'],
      body: 'Detect local CLIs automatically: install only what is missing, link what already exists, then choose an API profile to start a session or resume one from local history.',
      release: 'View GitHub Releases',
      github: 'View source',
      note: 'Available for macOS, Windows, and Linux',
      current: 'Latest release'
    },
    trust: ['Existing CLIs stay intact', 'Native config sync', 'Local session history', 'Open source under MIT'],
    agents: {
      label: 'One entry point, six agents',
      title: 'Keep the CLIs you know. Lose the repeated setup.',
      body: 'Agent Launcher still runs each project\'s own command-line tool. Existing installations keep their paths, config homes, and session history.'
    },
    showcase: {
      label: 'Real application screens',
      title: 'From linking to sessions, the workflow stays in one window.',
      tabs: ['Workspace', 'Profiles', 'MCP & Skills', 'Local usage'],
      items: [
        {
          title: 'Projects and session history',
          body: 'Browse each CLI\'s local history and associated directories, then start in the embedded terminal or resume an existing session.'
        },
        {
          title: 'Provider profiles and connectivity checks',
          body: 'Keep multiple account or API profiles per agent. Switching one syncs the environment and native files that CLI reads, with a minimal real request to verify connectivity.'
        },
        {
          title: 'Inspect installed MCP servers and Skills',
          body: 'See MCP entries and Skills from each CLI\'s native config. Agent Launcher reads what is installed and does not install Skills from a remote catalog.'
        },
        {
          title: 'Local session usage',
          body: 'Summarize tokens, requests, sessions, and model distribution from local history without uploading it to a separate analytics service.'
        }
      ]
    },
    workflow: {
      label: 'Get started',
      title: 'One-click install, configure, and launch.',
      items: [
        ['One-click install', 'Scans your system for CLIs. If one is missing, the app uses that CLI\'s official installation path; existing commands are linked without reinstalling or upgrading.'],
        ['One-click configure', 'Pick an official account or compatible API profile. The app writes the environment variables and native config files the CLI reads, then verifies connectivity.'],
        ['One-click launch', 'Start a new session in the embedded terminal or chat view, or resume an existing one from local history.']
      ]
    },
    details: {
      label: 'Built for daily work',
      title: 'It does not replace your CLIs. It organizes them.',
      items: [
        ['Existing installs stay intact', 'Detection runs before every install attempt. If a command exists, Agent Launcher links it without reinstalling, repairing, or upgrading.'],
        ['Native config sync', 'File-backed config for Claude Code, Codex, OpenCode, Pi, and Hermes; environment-only setup for Gemini.'],
        ['History across formats', 'Read each CLI\'s own JSONL, JSON, or SQLite history and resume with its native command arguments.'],
        ['Explicit control for risky modes', 'Auto-approval is opt-in per supported CLI. Pi has no redundant toggle because it does not prompt for approval.']
      ]
    },
    privacy: {
      label: 'Local-first, not offline theater',
      title: 'Local data stays local. Model requests go where you choose.',
      body: 'Agent Launcher reads sessions, configuration, and usage on your machine and has no separate analytics service. Running an agent sends requests to the official provider or relay in the active profile; version checks may contact GitHub, npm, or PyPI.',
      keyTitle: 'About API keys',
      keyBody: 'By design, keys are stored as plaintext in ~/.agent-launcher/config.json and, when required, native CLI config files. The interface masks them, but your local user account can still read those files.'
    },
    download: {
      title: 'Put six agents in one workspace.',
      body: 'Get the macOS, Windows, or Linux package from GitHub Releases.',
      action: 'Go to downloads',
      source: 'Read the README'
    },
    faq: {
      label: 'FAQ',
      title: 'Clear boundaries make better tools.',
      items: [
        ['Will one-click install overwrite my existing CLIs?', 'No. Agent Launcher links existing commands first. One-click install appears only when a CLI cannot be found; it never upgrades or modifies existing installations.'],
        ['Where is data stored?', 'Application state lives under ~/.agent-launcher/. System-linked CLIs keep using their own configuration and history directories.'],
        ['Which packages are supported?', 'macOS has DMG and ZIP builds for Intel and Apple silicon, Windows uses NSIS, and Linux uses AppImage. Available files are listed on GitHub Releases.'],
        ['Is it completely offline?', 'No. Configuration, history, and usage are handled locally, but agent requests go to your selected model service and version checks can reach public software sources.']
      ]
    },
    footer: { description: 'A local desktop workspace for configuring and running existing coding-agent CLIs.', license: 'MIT License', issues: 'Report an issue' },
    platform: { mac: 'macOS', windows: 'Windows', linux: 'Linux', other: 'desktop' }
  }
} as const

type Copy = (typeof copy)[Locale]

const agents = [
  { name: 'Claude Code', vendor: 'Anthropic', color: '#d97757', Icon: ClaudeCode.Color },
  { name: 'Codex CLI', vendor: 'OpenAI', color: '#10a37f', Icon: Codex },
  { name: 'OpenCode', vendor: 'SST', color: '#f2a60d', Icon: OpenCode },
  { name: 'Pi', vendor: 'earendil', color: '#7c3aed', glyph: 'π' },
  { name: 'Gemini CLI', vendor: 'Google', color: '#4285f4', Icon: GeminiCLI.Color },
  { name: 'Hermes Agent', vendor: 'Nous Research', color: '#d7a900', Icon: HermesAgent }
] as const

const showcaseIcons = [FolderOpen, KeyRound, ServerCog, BarChart3]
const detailIcons = [PackageCheck, FileCode2, History, ShieldCheck]
const workflowIcons = [Link2, MonitorCog, Play]
const heroStepIcons = [PackageCheck, Settings2, Play]

function detectPlatform(): Platform {
  const value = navigator.userAgent.toLowerCase()
  if (value.includes('mac')) return 'mac'
  if (value.includes('win')) return 'windows'
  if (value.includes('linux')) return 'linux'
  return 'other'
}

function AgentIcon({ agent }: { agent: (typeof agents)[number] }) {
  if ('Icon' in agent) {
    const Icon = agent.Icon as ComponentType<{ size?: number }>
    return <Icon size={29} />
  }
  return <span className="pi-icon">{agent.glyph}</span>
}

function GitHubIcon({ size = 24 }: { size?: number }) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor">
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

type DemoScreen = 'workspace' | 'profiles' | 'resources' | 'usage' | 'terminal'

const demoAgents = [
  { id: 'claude-code', name: 'Claude Code' },
  { id: 'codex', name: 'Codex CLI' },
  { id: 'opencode', name: 'OpenCode' },
  { id: 'pi', name: 'Pi' },
  { id: 'gemini', name: 'Gemini CLI' },
  { id: 'hermes', name: 'Hermes Agent' }
] as const

function DemoCliIcon({ cliId, size = 16 }: { cliId: DemoCliId; size?: number }) {
  if (cliId === 'claude-code') return <ClaudeCode.Color size={size} />
  if (cliId === 'codex') return <Codex size={size} />
  if (cliId === 'opencode') return <OpenCode size={size} />
  if (cliId === 'gemini') return <GeminiCLI.Color size={size} />
  if (cliId === 'hermes') return <HermesAgent size={size} />
  return <span className="demo-pi-glyph" style={{ fontSize: size * 0.8 }}>π</span>
}

const demoText = {
  zh: {
    stages: ['选择 Agent', '配置连接', '查看历史', '开始会话'],
    history: '历史会话', refresh: '刷新', settings: 'Agent 设置', terminal: '打开终端', newSession: '新建会话',
    profiles: '服务商配置', resources: 'MCP 与 Skills', usage: '本地用量', active: '使用中', connected: '连接正常',
    selectProject: '项目目录', resume: '继续之前的会话', localData: '读取本地会话记录', requests: '请求数', sessions: '会话数', tokens: 'Token 总量'
  },
  en: {
    stages: ['Choose agent', 'Configure', 'View history', 'Start session'],
    history: 'Session history', refresh: 'Refresh', settings: 'Agent settings', terminal: 'Open terminal', newSession: 'New session',
    profiles: 'Provider profiles', resources: 'MCP & Skills', usage: 'Local usage', active: 'Active', connected: 'Connected',
    selectProject: 'Project folder', resume: 'Resume a previous session', localData: 'Read from local session history', requests: 'Requests', sessions: 'Sessions', tokens: 'Total tokens'
  }
} as const

function DemoSidebar({ active = 'Codex CLI' }: { active?: string }) {
  return (
    <aside className="demo-sidebar" aria-hidden="true">
      <div className="demo-sidebar-title">AGENTS</div>
      <div className="demo-agent-list">
        {demoAgents.map((agent) => (
          <div className={`demo-agent ${agent.name === active ? 'active' : ''}`} key={agent.name}>
            <span className="demo-agent-icon"><DemoCliIcon cliId={agent.id} /></span>
            <span>{agent.name}</span>
            <i />
          </div>
        ))}
      </div>
      <div className="demo-sidebar-footer">
        <span><Settings2 size={13} />Settings</span>
        <span><RefreshCw size={13} />Rerun setup</span>
      </div>
    </aside>
  )
}

function DemoWorkspace({ locale, launching = false }: { locale: Locale; launching?: boolean }) {
  const d = demoText[locale]
  return (
    <div className="demo-pane demo-workspace">
      <div className="demo-toolbar">
        <div className="demo-toolbar-start"><strong>{d.history}</strong><span>{d.refresh}</span><button><Folder size={13} /> agent-launcher</button></div>
        <div className="demo-toolbar-actions">
          <button><SlidersHorizontal size={13} />{d.settings}</button>
          <button>{d.terminal}</button>
          <button className={launching ? 'demo-primary demo-pulse' : 'demo-primary'}><Plus size={13} />{d.newSession}</button>
        </div>
      </div>
      <div className="demo-project-strip">
        <div><FolderOpen size={18} /><span><strong>{locale === 'zh' ? '按关联目录筛选' : 'Filter by associated directory'}</strong><small>~/Projects/agent-launcher</small></span></div>
        <ChevronRight size={17} />
      </div>
      <div className="demo-session-heading"><span>{d.resume}</span><small>{d.localData}</small></div>
      <div className="demo-session-list">
        <div className="demo-session active"><span className="demo-session-icon"><DemoCliIcon cliId="codex" size={17} /></span><div><strong>Improve installer detection</strong><small>Today 10:42 · ~/Projects/agent-launcher</small></div><ChevronRight size={15} /></div>
        <div className="demo-session"><span className="demo-session-icon"><DemoCliIcon cliId="codex" size={17} /></span><div><strong>Review native configuration</strong><small>Yesterday 18:06 · ~/Projects/agent-launcher</small></div><ChevronRight size={15} /></div>
      </div>
    </div>
  )
}

function DemoProfiles({ locale }: { locale: Locale }) {
  const d = demoText[locale]
  const profiles = [
    ['OpenAI Official', 'ChatGPT account · gpt-5'],
    ['Team Relay', 'https://relay.example.com/v1 · gpt-5-codex'],
    ['OpenRouter', 'https://openrouter.ai/api/v1 · openai/gpt-5']
  ]
  return (
    <div className="demo-pane demo-agent-settings">
      <div className="demo-settings-intro">
        <span><ArrowLeft size={10} />{locale === 'zh' ? '返回对话列表' : 'Back to sessions'}</span>
        <h3>{locale === 'zh' ? 'Agent 设置' : 'Agent settings'}</h3>
        <p>{locale === 'zh' ? '每个 CLI 可存多套配置，一键切换当前生效的那套。使用系统 CLI 时，CLI 继续读取自己的系统配置目录。' : 'Keep multiple profiles per CLI and switch the active one. System CLIs continue using their own config directories.'}</p>
      </div>
      <div className="demo-config-tabs"><button className="active"><FolderCog size={12} />{locale === 'zh' ? '配置' : 'Profiles'}</button><button><Server size={12} />MCP</button><button><Sparkles size={12} />Skill</button></div>
      <div className="demo-profile-list demo-profile-list-faithful">
        {profiles.map(([name, meta], index) => (
          <div className={`demo-profile ${index === 0 ? 'active' : ''}`} key={name}>
            <span className="demo-radio">{index === 0 && <i />}</span>
            <div><strong>{name}{index === 0 && <b>{d.active}</b>}</strong><small>{meta}</small></div>
            <span className="demo-row-actions"><Pencil size={11} /><Trash2 size={11} /></span>
          </div>
        ))}
        <button className="demo-add-profile"><Plus size={11} />{locale === 'zh' ? '新增配置' : 'Add profile'}</button>
        <div className="demo-native-title"><strong>{locale === 'zh' ? '原生配置文件' : 'Native config files'}</strong><small>{locale === 'zh' ? '切换配置时自动写入 CLI 使用的原生文件。' : 'Updated automatically when switching profiles.'}</small></div>
        <div className="demo-native-file"><FileCode2 size={12} /><span>config.toml</span><code>[model_providers.openai]</code></div>
      </div>
    </div>
  )
}

function DemoResources({ locale }: { locale: Locale }) {
  const rows = [
    ['node_repl', 'STDIO', '/Applications/Codex.app/Contents/Resources/cua_node/bin/node_repl', '~/.codex/config.toml'],
    ['filesystem', 'STDIO', 'npx -y @modelcontextprotocol/server-filesystem', '~/.codex/config.toml'],
    ['github', 'HTTP', 'https://api.githubcopilot.com/mcp/', '~/.codex/config.toml']
  ]
  return (
    <div className="demo-pane demo-agent-settings demo-mcp-faithful">
      <div className="demo-settings-intro">
        <span><ArrowLeft size={10} />{locale === 'zh' ? '返回对话列表' : 'Back to sessions'}</span>
        <h3>{locale === 'zh' ? 'Agent 设置' : 'Agent settings'}</h3>
        <p>{locale === 'zh' ? '每个 CLI 可存多套配置，一键切换当前生效的那套。使用系统 CLI 时，CLI 继续读取自己的系统配置目录。' : 'Keep multiple profiles per CLI and inspect the resources in its native configuration.'}</p>
      </div>
      <div className="demo-config-tabs"><button><FolderCog size={12} />{locale === 'zh' ? '配置' : 'Profiles'}</button><button className="active"><Server size={12} />MCP</button><button><Sparkles size={12} />Skill</button></div>
      <section className="demo-resource-panel">
        <div className="demo-resource-heading"><h4>{locale === 'zh' ? 'MCP 服务器' : 'MCP servers'}</h4><p>{locale === 'zh' ? '展示当前 Agent 原生配置里的 MCP 条目。' : 'Entries found in the current agent\'s native configuration.'}</p></div>
        <div className="demo-resource-search"><Search size={12} />{locale === 'zh' ? '搜索已安装 MCP' : 'Search installed MCP'}</div>
        <div className="demo-resource-list-faithful">
          {rows.map(([name, type, command, path]) => (
            <div className="demo-resource-row" key={name}>
              <span className="demo-resource-row-icon"><ServerCog size={14} /></span>
              <div><strong>{name}<b>{type}</b><em>{locale === 'zh' ? '启用' : 'Enabled'}</em></strong><small>{command}</small><small>{path}</small></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function DemoSettingsSidebar({ locale }: { locale: Locale }) {
  return (
    <aside className="demo-settings-sidebar" aria-hidden="true">
      <span><ArrowLeft size={11} />{locale === 'zh' ? '返回工作区' : 'Back to workspace'}</span>
      <nav>
        <div><SlidersHorizontal size={12} />{locale === 'zh' ? '通用' : 'General'}</div>
        <div className="active"><BarChart3 size={12} />{locale === 'zh' ? '用量' : 'Usage'}</div>
        <div><CircleDot size={12} />{locale === 'zh' ? '关于' : 'About'}</div>
      </nav>
    </aside>
  )
}

function DemoUsage({ locale }: { locale: Locale }) {
  const d = demoText[locale]
  const bars = [18, 32, 24, 55, 42, 72, 48, 85, 64, 92, 70, 100, 78, 62, 88, 54, 96, 74, 48, 66, 82, 57, 74, 91]
  const heat = Array.from({ length: 371 }, (_, index) => {
    if (index % 11 === 0 || index % 17 === 0) return 0
    return ((index * 13 + Math.floor(index / 7) * 3) % 4) + 1
  })
  const months = locale === 'zh'
    ? ['8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月']
    : ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  return (
    <div className="demo-usage-shell">
      <DemoSettingsSidebar locale={locale} />
      <div className="demo-pane demo-usage demo-usage-faithful">
        <h3>{d.usage}</h3>
        <section className="demo-usage-summary">
          <div className="demo-usage-top"><div><strong>{locale === 'zh' ? '本地会话用量' : 'Local session usage'}</strong><p>{locale === 'zh' ? '从各 CLI 本地历史汇总 token、请求和会话。' : 'Summarized from each CLI\'s local session history.'}</p></div><button><RefreshCw size={11} />{d.refresh}</button></div>
          <div className="demo-metrics"><div><strong>1.28M</strong><span>{locale === 'zh' ? '近 30 天 Token' : '30-day tokens'}</span></div><div><strong>486</strong><span>{locale === 'zh' ? '近 30 天请求' : '30-day requests'}</span></div><div><strong>12 / 7</strong><span>{locale === 'zh' ? '活跃天数 / 最长连续' : 'Active / best streak'}</span></div><div><strong>48.6K</strong><span>{locale === 'zh' ? '今日 Token' : 'Tokens today'}</span></div></div>
          <div className="demo-heatmap-head"><strong>{locale === 'zh' ? '活动热力图' : 'Activity'}</strong><span>{locale === 'zh' ? '过去一年 8.42M Token' : '8.42M tokens in the last year'}</span></div>
          <div className="demo-heatmap">
            <div className="demo-heatmap-body">
              <div className="demo-heat-weekdays"><span>{locale === 'zh' ? '一' : 'Mon'}</span><span>{locale === 'zh' ? '三' : 'Wed'}</span><span>{locale === 'zh' ? '五' : 'Fri'}</span></div>
              <div className="demo-heat-content"><div className="demo-heat-months">{months.map((month) => <span key={month}>{month}</span>)}</div><div className="demo-heat-grid">{heat.map((level, index) => <i data-level={level} key={index} />)}</div></div>
            </div>
            <div className="demo-heat-legend"><span>{locale === 'zh' ? '少' : 'Less'}</span>{[0, 1, 2, 3, 4].map((level) => <i data-level={level} key={level} />)}<span>{locale === 'zh' ? '多' : 'More'}</span></div>
          </div>
          <div className="demo-usage-lower">
            <div className="demo-models"><strong>{locale === 'zh' ? '模型分布' : 'Model distribution'}</strong><div><span>gpt-5</span><i><b style={{ width: '100%' }} /></i><small>68%</small></div><div><span>claude-sonnet</span><i><b style={{ width: '36%' }} /></i><small>24%</small></div><div><span>gemini-2.5-pro</span><i><b style={{ width: '12%' }} /></i><small>8%</small></div></div>
            <div className="demo-daily"><div><strong>{locale === 'zh' ? '每日用量' : 'Daily usage'}</strong><span>{locale === 'zh' ? '最近 30 天' : 'Last 30 days'}</span></div><div className="demo-bars">{bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
          </div>
        </section>
        <section className="demo-agent-usage"><strong>{locale === 'zh' ? '按 Agent 查看' : 'By agent'}</strong><div><span><DemoCliIcon cliId="claude-code" size={14} /></span><p><b>Claude Code</b><small>126 requests · 9 sessions</small></p><em>612K</em></div><div><span><DemoCliIcon cliId="codex" size={14} /></span><p><b>Codex CLI</b><small>248 requests · 18 sessions</small></p><em>504K</em></div></section>
      </div>
    </div>
  )
}

function DemoTerminal({ locale }: { locale: Locale }) {
  return (
    <div className="demo-pane demo-terminal">
      <div className="demo-terminal-tabs"><button><ChevronRight size={13} />{locale === 'zh' ? '历史会话' : 'History'}</button><span>Codex CLI · agent-launcher</span><button className="active">{locale === 'zh' ? '新建会话' : 'New session'} <X size={12} /></button><button><Plus size={13} /></button></div>
      <div className="demo-terminal-body">
        <div className="demo-terminal-brand"><span>›_</span><div><strong>Codex CLI</strong><small>~/Projects/agent-launcher</small></div></div>
        <p><b>›</b> Check the CLI detection flow and improve its tests.</p>
        <div className="demo-terminal-log"><span>• Reading src/main/install/detect.ts</span><span>• Reading tests/main/install-policy.test.ts</span><span className="done">✓ Found the existing-install policy and added focused coverage.</span></div>
        <div className="demo-terminal-input"><span>›</span><i /></div>
      </div>
    </div>
  )
}

function ProductDemo({ screen, locale, launching = false }: { screen: DemoScreen; locale: Locale; launching?: boolean }) {
  const activeAgent = screen === 'terminal' ? 'Codex CLI' : 'Codex CLI'
  return (
    <div className="product-demo">
      <div className="window-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <div className="window-title">Agent Launcher</div>
      </div>
      <div className={`demo-app-body ${screen === 'usage' ? 'demo-app-body-settings' : ''}`}>
        {screen !== 'usage' && <DemoSidebar active={activeAgent} />}
        <div className="demo-screen" key={`${screen}-${launching}`}>
          {screen === 'workspace' && <DemoWorkspace locale={locale} launching={launching} />}
          {screen === 'profiles' && <DemoProfiles locale={locale} />}
          {screen === 'resources' && <DemoResources locale={locale} />}
          {screen === 'usage' && <DemoUsage locale={locale} />}
          {screen === 'terminal' && <DemoTerminal locale={locale} />}
        </div>
      </div>
      {screen !== 'usage' && <div className="demo-statusbar"><span><i />Codex CLI</span><span>{locale === 'zh' ? '已关联' : 'Linked'}</span></div>}
    </div>
  )
}

function HeroDemo({ locale }: { locale: Locale }) {
  const [step, setStep] = useState(0)
  const d = demoText[locale]
  const screens: DemoScreen[] = ['workspace', 'profiles', 'workspace', 'terminal']

  useEffect(() => {
    const timer = window.setInterval(() => setStep((current) => (current + 1) % screens.length), 2400)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="hero-demo-wrap">
      <ProductDemo screen={screens[step]} locale={locale} launching={step === 2} />
      <div className="demo-journey" aria-label={locale === 'zh' ? '使用流程演示' : 'Product workflow demo'}>
        {d.stages.map((stage, index) => (
          <button className={step === index ? 'active' : ''} onClick={() => setStep(index)} key={stage} aria-label={stage}>
            <span>0{index + 1}</span>{stage}<i />
          </button>
        ))}
      </div>
    </div>
  )
}

export function App({ locale }: { locale: Locale }) {
  const [activeShot, setActiveShot] = useState(0)
  const [showcaseInView, setShowcaseInView] = useState(false)
  const [showcasePaused, setShowcasePaused] = useState(false)
  const [showcaseCycle, setShowcaseCycle] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [platform, setPlatform] = useState<Platform>('other')
  const [release, setRelease] = useState<string | null>(null)
  const showcaseRef = useRef<HTMLElement>(null)
  const t: Copy = copy[locale]

  useEffect(() => {
    setPlatform(detectPlatform())
    fetch('https://api.github.com/repos/WhiteMatrixTech/agent-launcher/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { tag_name?: string } | null) => setRelease(data?.tag_name ?? null))
      .catch(() => setRelease(null))
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = showcaseRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowcaseInView(entry.isIntersecting),
      { threshold: 0.35 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!showcaseInView || showcasePaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActiveShot((current) => (current + 1) % 4), 4500)
    return () => window.clearInterval(timer)
  }, [showcaseCycle, showcaseInView, showcasePaused])

  const releaseLabel = useMemo(() => {
    if (!release) return t.hero.release
    const platformName = t.platform[platform]
    return locale === 'zh' ? `查看 ${platformName} 安装包` : `View ${platformName} builds`
  }, [locale, platform, release, t.hero.release, t.platform])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell min-h-screen">
      <header className="site-header">
        <a className="brand" href={locale === 'zh' ? '/' : '/en/'} aria-label="Agent Launcher">
          <img src="/app-icon.png" alt="" />
          <span>Agent Launcher</span>
        </a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Primary navigation">
          <a href="#agents" onClick={closeMenu}>{t.nav.agents}</a>
          <a href="#features" onClick={closeMenu}>{t.nav.features}</a>
          <a href="#privacy" onClick={closeMenu}>{t.nav.privacy}</a>
          <a href="#faq" onClick={closeMenu}>{t.nav.faq}</a>
        </nav>
        <div className="header-actions">
          <div className="locale-switch" aria-label="Language">
            <Globe2 size={15} aria-hidden="true" />
            <a className={locale === 'zh' ? 'active' : ''} href="/" lang="zh-CN" aria-current={locale === 'zh' ? 'page' : undefined}>中</a>
            <a className={locale === 'en' ? 'active' : ''} href="/en/" lang="en" aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
          </div>
          <a className="icon-link" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon size={19} />
          </a>
          <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Menu">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-copy" data-reveal>
            <div className="eyebrow"><TerminalSquare size={15} />{t.hero.eyebrow}</div>
            <h1>{t.hero.title}</h1>
            <p className="hero-lead">{t.hero.lead}</p>
            <div className="hero-steps" aria-label={t.workflow.title}>
              {t.hero.steps.map((step, index) => {
                const Icon = heroStepIcons[index]
                return (
                  <span key={step}>
                    <Icon size={17} aria-hidden="true" />
                    {step}
                  </span>
                )
              })}
            </div>
            <p className="hero-body">{t.hero.body}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={RELEASES_URL} target="_blank" rel="noreferrer">
                <Download size={18} />{releaseLabel}<ChevronRight size={17} />
              </a>
              <a className="button button-secondary" href={GITHUB_URL} target="_blank" rel="noreferrer">
                <GitHubIcon size={18} />{t.hero.github}
              </a>
            </div>
            <div className="hero-meta">
              <span>{t.hero.note}</span>
              {release && <span><CircleDot size={12} />{t.hero.current} {release}</span>}
            </div>
          </div>
          <div className="hero-visual" data-reveal>
            <div className="hero-rail" aria-hidden="true">
              {agents.map((agent) => <span key={agent.name} style={{ background: agent.color }} />)}
            </div>
            <HeroDemo locale={locale} />
          </div>
        </section>

        <section className="trust-band" aria-label="Product principles">
          <div className="trust-inner">
            {t.trust.map((item) => <span key={item}><Check size={15} />{item}</span>)}
          </div>
        </section>

        <section className="agents-section section-pad" id="agents">
          <div className="section-heading" data-reveal>
            <div className="eyebrow">{t.agents.label}</div>
            <h2>{t.agents.title}</h2>
            <p>{t.agents.body}</p>
          </div>
          <div className="agent-grid" data-reveal>
            {agents.map((agent) => (
              <article className="agent-item" key={agent.name} style={{ '--agent-color': agent.color } as React.CSSProperties}>
                <div className="agent-icon"><AgentIcon agent={agent} /></div>
                <div><h3>{agent.name}</h3><p>{agent.vendor}</p></div>
                <ArrowRight size={17} aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section
          className="showcase-section section-pad"
          id="features"
          ref={showcaseRef}
          onMouseEnter={() => setShowcasePaused(true)}
          onMouseLeave={() => setShowcasePaused(false)}
          onFocusCapture={() => setShowcasePaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setShowcasePaused(false)
          }}
        >
          <div className="section-heading wide" data-reveal>
            <div className="eyebrow">{t.showcase.label}</div>
            <h2>{t.showcase.title}</h2>
          </div>
          <div className="showcase-layout" data-reveal>
            <div className="showcase-tabs" role="tablist" aria-label={t.showcase.label}>
              {t.showcase.tabs.map((tab, index) => {
                const Icon = showcaseIcons[index]
                return (
                  <button
                    key={tab}
                    className={activeShot === index ? 'active' : ''}
                    role="tab"
                    aria-selected={activeShot === index}
                    onClick={() => {
                      setActiveShot(index)
                      setShowcaseCycle((cycle) => cycle + 1)
                    }}
                  >
                    <Icon size={18} />
                    <span>{tab}</span>
                  </button>
                )
              })}
            </div>
            <div className="showcase-copy">
              <span className="shot-number">0{activeShot + 1} / 04</span>
              <h3>{t.showcase.items[activeShot].title}</h3>
              <p>{t.showcase.items[activeShot].body}</p>
            </div>
            <div className="showcase-image">
              <ProductDemo
                screen={(['workspace', 'profiles', 'resources', 'usage'] as DemoScreen[])[activeShot]}
                locale={locale}
              />
            </div>
          </div>
        </section>

        <section className="workflow-section section-pad">
          <div className="section-heading" data-reveal>
            <div className="eyebrow">{t.workflow.label}</div>
            <h2>{t.workflow.title}</h2>
          </div>
          <div className="workflow-grid">
            {t.workflow.items.map(([title, body], index) => {
              const Icon = workflowIcons[index]
              return (
                <article key={title} data-reveal>
                  <div className="step-top"><span>0{index + 1}</span><Icon size={21} /></div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="details-section">
          <div className="details-layout section-pad">
            <div className="section-heading" data-reveal>
              <div className="eyebrow">{t.details.label}</div>
              <h2>{t.details.title}</h2>
            </div>
            <div className="detail-list" data-reveal>
              {t.details.items.map(([title, body], index) => {
                const Icon = detailIcons[index]
                return (
                  <article key={title}>
                    <Icon size={21} />
                    <div><h3>{title}</h3><p>{body}</p></div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="privacy-section" id="privacy">
          <div className="privacy-inner section-pad">
            <div className="privacy-copy" data-reveal>
              <div className="eyebrow"><ShieldCheck size={15} />{t.privacy.label}</div>
              <h2>{t.privacy.title}</h2>
              <p>{t.privacy.body}</p>
            </div>
            <div className="key-note" data-reveal>
              <KeyRound size={22} />
              <div><h3>{t.privacy.keyTitle}</h3><p>{t.privacy.keyBody}</p></div>
            </div>
          </div>
        </section>

        <section className="download-band" id="download">
          <div className="download-section section-pad">
            <div className="download-mark" aria-hidden="true">
              <img src="/app-icon.png" alt="" />
            </div>
            <div className="download-copy" data-reveal>
              <h2>{t.download.title}</h2>
              <p>{t.download.body}</p>
            </div>
            <div className="download-actions" data-reveal>
              <a className="button button-light" href={RELEASES_URL} target="_blank" rel="noreferrer">
                <Download size={18} />{t.download.action}<ExternalLink size={16} />
              </a>
              <a className="text-link-light" href={`${GITHUB_URL}#readme`} target="_blank" rel="noreferrer">
                {t.download.source}<ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="faq-section section-pad" id="faq">
          <div className="section-heading" data-reveal>
            <div className="eyebrow">{t.faq.label}</div>
            <h2>{t.faq.title}</h2>
          </div>
          <div className="faq-list" data-reveal>
            {t.faq.items.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary><span>{question}</span><span className="faq-plus">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/app-icon.png" alt="" />
          <div><strong>Agent Launcher</strong><p>{t.footer.description}</p></div>
        </div>
        <div className="footer-links">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer"><GitHubIcon size={16} />GitHub</a>
          <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">{t.footer.license}</a>
          <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer">{t.footer.issues}</a>
        </div>
      </footer>
    </div>
  )
}
