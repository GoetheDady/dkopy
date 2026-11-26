# 发版指南

推送版本标签会自动发布 npm 包，但不会自动创建 GitHub Release（显示版本标题和更新说明的页面）。

## 1. 更新版本并推送标签

运行 `npm version patch --no-git-tag-version`，同时更新 `package.json` 和 `package-lock.json`，但不自动提交或打标签。根据实际改动选择版本增量，并把面向用户的更新说明写入 `CHANGELOG.md`。提交并推送后，为该提交创建同版本的标签。以下以 `0.2.2` 为例：

```bash
git tag -a v0.2.2 -m 'dkopy 0.2.2'
git push origin v0.2.2
```

`publish.yml` 会核对标签与包版本、按锁文件安装依赖、构建和检查类型，并在测试通过后发布。npm Trusted Publishing 让 GitHub Actions 用自身身份换取短期发布凭据：在 npm 的 `dkopy` 包设置中授权 `GoetheDady/dkopy` 的 `publish.yml`，环境名称留空，不需要长期令牌。

## 2. 确认 npm 发布

在 GitHub Actions 确认发布成功，并运行 `npm view dkopy@0.2.2 version` 和 `npm view dkopy version`，分别核对该版本可查询、最新版本已更新。如果流程成功但 npm 暂时查不到，稍后再查，不要直接重发。

## 3. 创建 GitHub Release

将 `CHANGELOG.md` 中对应版本的改动整理为 Markdown 文件（例如 `/tmp/dkopy-release.md`），用已有标签创建正式发布条目。把示例标题的「一句话摘要」替换为实际改动：

```bash
gh release create v0.2.2 --verify-tag --title '0.2.2：一句话摘要' --notes-file /tmp/dkopy-release.md --latest
```

如果该标签已有 Release，就编辑现有条目，不要重复创建或推送标签。完成后打开 [GitHub Releases](https://github.com/GoetheDady/dkopy/releases)，核对版本标题和正文。
