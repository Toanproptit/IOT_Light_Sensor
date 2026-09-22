import {
  BookOpen,
  Box,
  Code2,
  ExternalLink,
  GitBranch,
  Lightbulb,
  Palette,
  ShieldCheck,
} from 'lucide-react'
import PageIntro from '../../components/common/PageIntro'

const PROFILE_LINKS = [
  { label: 'GitHub', description: 'Source code dự án', href: 'https://github.com/', icon: GitBranch, className: 'github' },
  { label: 'Figma', description: 'UI/UX Design', href: 'https://www.figma.com/', icon: Palette, className: 'figma' },
  { label: 'Project Docs', description: 'Tài liệu dự án', href: '#project-docs', icon: BookOpen, className: 'docs' },
  { label: 'API Document', description: 'REST API Reference', href: '/docs/API_DOCUMENTATION.md', icon: Code2, className: 'api' },
]

function InfoField({ label, value, wide }) {
  return (
    <div className={`info-field ${wide ? 'wide' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ProjectLink({ link }) {
  const Icon = link.icon
  const opensInNewTab = link.href.startsWith('http') || link.href.endsWith('.md')

  return (
    <a
      className="project-link"
      href={link.href}
      target={opensInNewTab ? '_blank' : undefined}
      rel={opensInNewTab ? 'noreferrer' : undefined}
    >
      <span className={`link-icon ${link.className}`}><Icon size={20} /></span>
      <span><strong>{link.label}</strong><small>{link.description}</small></span>
      <ExternalLink size={16} />
    </a>
  )
}

export default function ProfilePage() {
  return (
    <div className="page profile-page">
      <PageIntro
        eyebrow="Tài khoản"
        title="Thông tin cá nhân"
        description="Quản lý hồ sơ, quyền truy cập và tài nguyên dự án của bạn."
      />

      <div className="profile-grid">
        <section className="profile-hero card">
          <div className="profile-cover">
            <span className="cover-orb orb-one" />
            <span className="cover-orb orb-two" />
            <Lightbulb size={52} />
          </div>
          <div className="profile-main">
            <div className="avatar profile-avatar">TT<span className="online-dot" /></div>
            <div className="profile-identity">
              <div className="verified"><span>Đang hoạt động</span><ShieldCheck size={15} /></div>
              <h2>Nguyễn Trọng Toàn</h2>
              <p>Sinh viên PTIT · IoT Developer</p>
            </div>
            <div className="profile-actions">
              <button className="dark-button">Chỉnh sửa hồ sơ</button>
              <button className="secondary-button">Đổi mật khẩu</button>
            </div>
          </div>
        </section>

        <aside className="profile-side">
          <div className="card profile-stat">
            <span><Box size={20} /></span>
            <div><strong>03</strong><small>Đèn LED quản lý</small></div>
          </div>
          <div className="card account-plan">
            <span>Gói tài khoản</span><strong>Pro</strong><small>Đang hoạt động</small>
          </div>
        </aside>

        <section className="card details-card">
          <div className="section-head">
            <div><h2>Thông tin chi tiết</h2><p>Thông tin học tập và liên hệ</p></div>
            <span className="permission"><ShieldCheck size={15} /> Quyền truy cập: Full</span>
          </div>
          <div className="detail-grid">
            <InfoField label="Họ và tên" value="Nguyễn Trọng Toàn" />
            <InfoField label="Mã sinh viên" value="B23DCCN833" />
            <InfoField label="Học viện" value="PTIT" />
            <InfoField label="Email" value="b23dccn833@stu.ptit.edu.vn" wide />
            <InfoField label="Khu vực thực hành" value="Phòng IoT 01 · PTIT" wide />
          </div>
        </section>

        <section className="card project-links">
          <div className="section-head">
            <div><h2>Tài nguyên dự án</h2><p>Liên kết thiết kế, mã nguồn và tài liệu</p></div>
            <ExternalLink size={18} />
          </div>
          <div className="link-grid">
            {PROFILE_LINKS.map((link) => <ProjectLink link={link} key={link.label} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
