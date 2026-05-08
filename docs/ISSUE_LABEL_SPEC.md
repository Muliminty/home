# GitHub Issues 标签规范

本文档定义了基于 GitHub Issues 作为内容管理系统时的标签命名规范。适用于任何使用 Issues 驱动内容发布的项目。

## 标签分类

标签使用命名空间前缀区分用途，分为三类：

| 类别 | 前缀 | 用途 |
|------|------|------|
| 内容形态 | `type:` | 定义 Issue 的内容类型 |
| 状态控制 | `status:` | 控制发布状态和展示权重 |
| 主题标签 | `tag:` | 内容分类，可叠加 |

非命名空间标签（如 `bug`、`enhancement`）不参与内容系统，仓库可正常用于项目管理。

---

## 内容形态标签（`type:*`）

| 标签 | 含义 |
|------|------|
| `type:article` | 文章，适合长内容 |
| `type:moment` | 动态/瞬间，适合短文字、多图片 |

### 校验规则

- 没有 `type:*` 标签的 Issue → 忽略，不进入内容系统
- 有且仅有一个 `type:*` → 进入内容解析
- 有多个 `type:*` → 构建失败（互斥）

---

## 状态标签（`status:*`）

| 标签 | 含义 | 是否发布 |
|------|------|----------|
| `status:draft` | 草稿 | 不发布 |
| `status:hidden` | 隐藏 | 不发布 |
| `status:pinned` | 置顶 | 发布，提高展示权重 |

### 说明

- `status:draft` 和 `status:hidden` 的 Issue 不会出现在站点中
- `status:pinned` 不代表发布状态，只影响排序权重
- 没有 `status:*` 标签 = 正常发布
- closed Issue 仍可作为历史内容展示

---

## 主题标签（`tag:*`）

主题标签可以叠加，用于内容分类和筛选。

### 示例

```txt
tag:frontend
tag:react
tag:astro
tag:life
tag:photo
tag:reading
tag:project
```

### 规则

- 一个 Issue 可以有多个 `tag:*`
- 标签自由增长，无需白名单
- URL 中使用去掉 `tag:` 前缀后的值（如 `tag:react` → `/tags/react`）

---

## 完整标签列表模板

在仓库中创建以下 Labels：

### 内容形态

| Label 名称 | 颜色建议 | 描述 |
|------------|----------|------|
| `type:article` | `#0075ca` | 文章型内容 |
| `type:moment` | `#e4e669` | 动态/瞬间型内容 |

### 状态控制

| Label 名称 | 颜色建议 | 描述 |
|------------|----------|------|
| `status:draft` | `#d4c5f9` | 草稿，不发布 |
| `status:hidden` | `#f9d0c4` | 隐藏，不发布 |
| `status:pinned` | `#0e8a16` | 置顶展示 |

### 主题标签（按需创建）

| Label 名称 | 颜色建议 | 描述 |
|------------|----------|------|
| `tag:frontend` | `#c5def5` | 前端相关 |
| `tag:react` | `#61dafb` | React |
| `tag:vue` | `#42b883` | Vue |
| `tag:astro` | `#ff5d01` | Astro |
| `tag:life` | `#fbca04` | 生活 |
| `tag:photo` | `#d93f0b` | 摄影 |
| `tag:reading` | `#bfd4f2` | 阅读 |
| `tag:project` | `#1d76db` | 项目 |

---

## 快速创建脚本

可使用 GitHub CLI 批量创建标签：

```bash
#!/bin/bash
REPO="owner/repo"

# 内容形态
gh label create "type:article" --repo $REPO --color "0075ca" --description "文章型内容"
gh label create "type:moment"  --repo $REPO --color "e4e669" --description "动态/瞬间型内容"

# 状态控制
gh label create "status:draft"  --repo $REPO --color "d4c5f9" --description "草稿，不发布"
gh label create "status:hidden" --repo $REPO --color "f9d0c4" --description "隐藏，不发布"
gh label create "status:pinned" --repo $REPO --color "0e8a16" --description "置顶展示"

# 主题标签（按需）
gh label create "tag:frontend" --repo $REPO --color "c5def5" --description "前端相关"
gh label create "tag:react"    --repo $REPO --color "61dafb" --description "React"
gh label create "tag:life"     --repo $REPO --color "fbca04" --description "生活"
gh label create "tag:photo"    --repo $REPO --color "d93f0b" --description "摄影"
gh label create "tag:reading"  --repo $REPO --color "bfd4f2" --description "阅读"
gh label create "tag:project"  --repo $REPO --color "1d76db" --description "项目"
```

---

## 注意事项

1. `type:article` 和 `type:moment` 互斥，同一 Issue 只能有一个
2. Pull Request 不参与内容系统（GitHub API 会将 PR 作为 Issue 返回，需过滤）
3. 标签 URL 不包含 `tag:` 前缀，避免冒号进入 URL
4. 非命名空间标签（`bug`、`enhancement` 等）被内容系统忽略，可正常用于项目管理
